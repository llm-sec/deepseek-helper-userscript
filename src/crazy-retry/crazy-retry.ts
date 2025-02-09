import SessionElement from "../selector/SessionElement";
import sleep from "../utils/sleep-util";
import Toast from "../ui/component/Toast";
import DeepSeekToastElement from "../selector/DeepSeekToastElement";
import logger from "../logger/Logger";
import AnswertElement from "../selector/AnswertElement";
import getElementFingerprint from "../utils/element-fingerprint";

// 指数退避配置参数
const RETRY_CONFIG = {
    BASE_DELAY: 1000,
    MAX_DELAY: 64 * 1000,
    BACKOFF_FACTOR: 2
};

// 新增元素级重试限制配置
const ELEMENT_RETRY_LIMIT = 128; // 每个元素最大重试次数
const elementRetryMap = new Map<string, number>(); // 存储元素哈希和重试次数的映射

export default async function runCrazyRetry() {
    logger.info("启动智能重试功能（元素级指数退避重试限制）");

    let currentDelay = RETRY_CONFIG.BASE_DELAY;
    let lastContentHash: string | null = null;

    while (true) {
        try {
            await sleep(currentDelay);

            const session = new SessionElement();
            const lastAnswerElement = session.findLastAnswerElement();

            if (!lastAnswerElement) {
                handleNoElementCase();
                continue;
            }

            const currentHash = await getContentHash(lastAnswerElement);

            // 检测到新内容时清理旧记录的计数器
            if (currentHash && currentHash !== lastContentHash) {
                cleanupOldHashRecord(lastContentHash);
                lastContentHash = currentHash;
            }

            // 检查元素重试次数
            if (currentHash && isElementOverRetryLimit(currentHash)) {
                handleRetryLimit(currentHash);
                continue;
            }

            if (!lastAnswerElement.isServerBusy()) {
                handleUnchangedContent();
                continue;
            }

            await performRetry(lastAnswerElement);
            resetBackoff();

        } catch (error) {
            await handleRetryError(error, lastContentHash);
            updateBackoff();
        }
    }

    // 内部工具函数
    async function getContentHash(element: AnswertElement): Promise<string | null> {
        try {
            return getElementFingerprint(element.answerElement);
        } catch {
            return null;
        }
    }

    function isElementOverRetryLimit(hash: string): boolean {
        const count = elementRetryMap.get(hash) || 0;
        return count >= ELEMENT_RETRY_LIMIT;
    }

    function cleanupOldHashRecord(oldHash: string | null) {
        if (oldHash && elementRetryMap.has(oldHash)) {
            elementRetryMap.delete(oldHash);
            logger.debug(`清理旧元素记录: ${oldHash}`);
        }
    }

    function handleNoElementCase() {
        logger.debug("未检测到回答元素，保持退避策略");
    }

    function handleRetryLimit(hash: string) {
        logger.warn(`元素 ${hash.slice(0, 6)}... 已达重试上限（${ELEMENT_RETRY_LIMIT}次）`);
        Toast.show("当前内容已达重试上限，请手动刷新", 5000);
        currentDelay = RETRY_CONFIG.MAX_DELAY; // 进入最大等待状态
    }

    function handleUnchangedContent() {
        logger.debug("内容未更新，维持退避策略");
    }

    async function performRetry(element: any) {
        logger.info(`[重试 ${elementRetryMap.get(lastContentHash!) || 0 + 1}/${ELEMENT_RETRY_LIMIT}] 服务器繁忙`);
        Toast.show("检测到回答失败，尝试自动刷新响应...", 3000);
        element.clickRefreshBtn();

        const toastElement = await DeepSeekToastElement.captureDeepSeekToast(3000);
        if (toastElement?.isTooFast()) {
            throw new Error("CLICK_TOO_FAST");
        }
    }

    async function handleRetryError(error: any, hash: string | null) {
        if (error.message === "CLICK_TOO_FAST") {
            await handleTooFastError();
        } else {
            updateElementRetryCount(hash);
            logger.error(`重试异常: ${error.message}`);
        }
    }

    function updateElementRetryCount(hash: string | null) {
        if (hash) {
            const count = (elementRetryMap.get(hash) || 0) + 1;
            elementRetryMap.set(hash, count);
            logger.debug(`元素 ${hash.slice(0, 6)}... 重试计数: ${count}/${ELEMENT_RETRY_LIMIT}`);
        }
    }

    async function handleTooFastError() {
        const waitMinutes = 30;
        logger.warn(`操作频率限制，等待${waitMinutes}分钟`);
        Toast.show(`操作过快，触发高等级封禁，功能临时不可用，${waitMinutes}分钟后再试`, 60 * 30 * 1000);
        await sleep(1000 * 60 * 30);
        resetBackoff();
    }

    function updateBackoff() {
        currentDelay = Math.min(
            currentDelay * RETRY_CONFIG.BACKOFF_FACTOR,
            RETRY_CONFIG.MAX_DELAY
        );
        logger.debug(`退避策略更新 → 等待时长：${currentDelay}ms`);
    }

    function resetBackoff() {
        currentDelay = RETRY_CONFIG.BASE_DELAY;
        logger.debug("重置基础等待时间");
    }
}