// TencentYuanBaoChatStatusMonitor.ts
/// <reference types="tampermonkey" />
import sleep from "../../utils/sleep-util";
import TencentYuanBaoChatList from "./TencentYuanBaoChatList";
import TencentYuanBaoChat from "./TencentYuanBaoChat";
import logger from "../../logger/Logger";
import alarmSound from '@assets/audio/explosion-42132.mp3';
import FaviconManager from "../../ui/FaviconManager";

/**
 * 智能聊天状态监控系统
 * 功能：监测AI消息状态变化并发送系统通知
 */
export default class TencentYuanBaoChatStatusMonitor {
    // 增强状态缓存（新增thinkingCompleted中间状态）
    private static lastState: {
        elementHash?: string;
        isThinking: boolean;
        isAnswerDone: boolean;
        thinkingCompleted: boolean;
    } = {isThinking: false, isAnswerDone: false, thinkingCompleted: false};

    // 配置参数（保持不变）
    private static readonly CONFIG = {
        POLL_INTERVAL: 100,
        NOTIFICATION_TIMEOUT: 5000
    };

    // 音频资源（保持不变）
    private static readonly NOTIFICATION_SOUND = {
        URL: 'https://cdn.pixabay.com/audio/2024/10/24/audio_90a178a3df.mp3',
        VOLUME: 1
    };

    static async run() {
        logger.info("启动增强版状态监控");
        while (true) {
            try {
                await this.checkStatus();
                await sleep(this.CONFIG.POLL_INTERVAL);
            } catch (error) {
                console.error('状态监控异常:', error);
                await sleep(1000);
            }
        }
    }

    /**
     * 增强版状态检测逻辑
     */
    private static async checkStatus(): Promise<void> {
        const chatList = new TencentYuanBaoChatList();
        const chat = chatList.getLastChat();
        if (!chat) return;

        const currentHash = chat.getChatId();
        const currentIsThinking = chat.isThinking();
        const currentIsAnswerDone = chat.isAnswerDone();

        if (this.isStatusChanged(currentHash, currentIsThinking, currentIsAnswerDone)) {
            logger.info(`chatId = ${currentHash}, 状态变更: 思考中[${currentIsThinking}] 回答完成[${currentIsAnswerDone}]`);

            // 更新图标状态
            this.updateFaviconState(currentIsThinking, currentIsAnswerDone);

            // 保存旧状态用于状态转移判断
            const previousState = {
                ...this.lastState,
                thinkingCompleted: this.lastState.thinkingCompleted
            };

            // 状态更新延迟到所有判断完成后
            const shouldUpdateState = () => {
                this.updateState(currentHash, currentIsThinking, currentIsAnswerDone);
            };

            // 第一步：思考中 -> 思考完成
            const isThinkingToCompleted =
                previousState.isThinking &&     // 之前处于思考状态
                !currentIsThinking &&          // 当前不在思考状态
                !currentIsAnswerDone;          // 回答尚未完成

            // 第二步：思考完成 -> 回答完成
            const isCompletedToAnswered =
                previousState.thinkingCompleted && // 之前处于思考完成状态
                currentIsAnswerDone;               // 当前回答完成

            if (isThinkingToCompleted) {
                logger.info("触发状态转移：思考中 → 思考完成");
                this.lastState.thinkingCompleted = true;

                // 新增自动折叠逻辑
                try {
                    await chat.foldThinkContent();
                    logger.info(`chatId = ${currentHash}, 已自动折叠思考过程`);
                } catch (error) {
                    logger.error(`折叠失败: ${(error as Error).message}`);
                    console.error('折叠操作异常:', error);
                }
            }

            if (isCompletedToAnswered) {
                logger.info("触发状态转移：思考完成 → 回答完成");
                await this.handleAnswerReady(chat);
                this.lastState.thinkingCompleted = false;
            }

            shouldUpdateState();
        }
    }

    /**
     * 更新网页图标状态
     */
    private static updateFaviconState(isThinking: boolean, isAnswerDone: boolean): void {
        try {
            const faviconManager = FaviconManager.getInstance();
            if (!faviconManager) return;

            if (isThinking) {
                faviconManager.setLoading();
            } else if (isAnswerDone) {
                faviconManager.setCompleted();
            }
        } catch (error) {
            console.error('图标状态更新失败:', error);
            logger.error(`图标操作异常: ${(error as Error).message}`);
        }
    }

    /**
     * 处理回答就绪事件
     */
    private static async handleAnswerReady(chat: TencentYuanBaoChat): Promise<void> {
        const answer = await this.retryGetAnswer(chat);
        this.showNotification('深度思考完成', answer);
    }

    /**
     * 带重试的内容获取（保持不变）
     */
    private static async retryGetAnswer(chat: TencentYuanBaoChat, retries = 3): Promise<string> {
        for (let i = 0; i < retries; i++) {
            const content = chat.getAnswerContent();
            if (content.trim()) return content;
            await sleep(500);
        }
        return '思考内容已生成';
    }

    /**
     * 改造后的油猴通知方法（增强版）
     */
    private static showNotification(title: string, body: string): void {
        try {
            logger.info(`发送通知，title = ${title}, body = ${body}`);

            try {
                const audio = new Audio(alarmSound);
                audio.volume = this.NOTIFICATION_SOUND.VOLUME;
                audio.play().catch((error) => {
                    logger.error(`音频播放失败: ${error.message}`);
                    console.error('音频播放错误:', error);
                });
            } catch (audioError) {
                logger.error(`音频初始化失败: ${(audioError as Error).message}`);
                console.error('音频初始化错误:', audioError);
            }
            
            chrome.runtime.sendMessage({
                type: 'showNotification',
                options: {
                    title: title,
                    message: this.formatNotificationBody(body),
                    type: 'basic',
                    iconUrl: 'icons/icon128.png' // background中无法访问getURL，直接使用相对路径
                }
            });
        } catch (error) {
            console.error('通知发送失败:', error);
            logger.error(`通知异常: ${(error as Error).message}`);
        }
    }

    /**
     * 安全处理通知内容（保持不变）
     */
    private static formatNotificationBody(body: string): string {
        const sanitized = body.replace(/[\x00-\x1F]/g, ''); // 过滤控制字符
        return sanitized.slice(0, 100) + (sanitized.length > 100 ? '...' : '');
    }

    /**
     * 确保超时值为正整数（保持不变）
     */
    private static ensurePositiveTimeout(): number {
        return Math.max(1000, this.CONFIG.NOTIFICATION_TIMEOUT || 5000);
    }

    private static isStatusChanged(
        hash: string,
        thinking: boolean,
        answerDone: boolean
    ): boolean {
        return hash !== this.lastState.elementHash ||
            thinking !== this.lastState.isThinking ||
            answerDone !== this.lastState.isAnswerDone;
    }

    private static updateState(
        hash: string,
        thinking: boolean,
        answerDone: boolean
    ): void {
        this.lastState = {
            elementHash: hash,
            isThinking: thinking,
            isAnswerDone: answerDone,
            thinkingCompleted: this.lastState.thinkingCompleted // 保持中间状态
        };
    }

}