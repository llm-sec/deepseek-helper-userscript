import MouseSimulator from "../../simulator/MouseSimulator";

/**
 * 腾讯元宝页面上的聊天记录
 *
 * 封装聊天记录项的核心属性和行为
 */
export default class TencentYuanBaoChat {
    private readonly _element: HTMLElement;
    private static readonly CLASS_NAMES = {
        HUMAN: 'agent-chat__list__item--human',
        AI: 'agent-chat__list__item--ai'
    } as const;

    constructor(element: HTMLElement) {
        if (!element) {
            throw new Error('必须提供有效的HTMLElement');
        }
        this._element = element;
    }

    /**
     * 判断是否为用户消息
     * @returns 当元素包含人类消息特征类时返回true
     */
    isHuman(): boolean {
        return this._element.classList.contains(TencentYuanBaoChat.CLASS_NAMES.HUMAN);
    }

    /**
     * 判断是否为AI消息
     * @returns 当元素包含AI消息特征类时返回true
     */
    isAi(): boolean {
        return this._element.classList.contains(TencentYuanBaoChat.CLASS_NAMES.AI);
    }

    /**
     * 获取消息类型标签（用于调试/日志）
     */
    get messageType(): string {
        return this.isHuman() ? '用户消息' :
            this.isAi() ? 'AI回复' : '未知类型';
    }

    /**
     * 安全访问原始元素
     */
    get element(): HTMLElement {
        return this._element.cloneNode(true) as HTMLElement;
    }

    /**
     * 验证元素有效性（防御性编程）
     */
    private validateElement(): void {
        if (!this._element?.classList) {
            throw new Error('无效的聊天记录元素');
        }
    }

    /**
     * 判断是否处于思考状态
     */
    isThinking(): boolean {
        const content = this._element.querySelector('.hyc-component-reasoner__think-header__content')?.textContent?.trim();
        return content === '思考中...';
    }

    /**
     * 判断思考是否完成
     */
    isThinkingDone(): boolean {
        const content = this._element.querySelector('.hyc-component-reasoner__think-header__content')?.textContent?.trim();
        return /^已深度思考（用时\d+秒）$/.test(content || '');
    }

    /**
     * 判断状态是否是思考已停止
     */
    isThinkingStop(): boolean {
        const content = this._element.querySelector('.hyc-component-reasoner__think-header__content')?.textContent?.trim();
        return content === '思考已停止';
    }

    /**
     * 获取思考内容（Markdown格式）
     */
    getThinkContent(): string {
        const contentElement = this._element.querySelector('.hyc-component-reasoner__think-content');
        return this.elementToMarkdown(contentElement);
    }

    /**
     * 获取回答内容（Markdown格式）
     */
    getAnswerContent(): string {
        const answerElement = this._element.querySelector('.hyc-component-reasoner__text');
        return this.elementToMarkdown(answerElement);
    }

    /**
     * 折叠思考内容
     */
    async foldThinkContent(): Promise<void> {
        const thinkElement = this._element.querySelector('.hyc-component-reasoner__think');
        if (thinkElement?.classList.contains('hyc-component-reasoner__think--expand')) {
            await new MouseSimulator().click(thinkElement);
        }
    }

    /**
     * 展开思考内容
     */
    async expandFoldThinkContent(): Promise<void> {
        const thinkElement = this._element.querySelector('.hyc-component-reasoner__think');
        if (thinkElement && !thinkElement.classList.contains('hyc-component-reasoner__think--expand')) {
            await new MouseSimulator().click(thinkElement);
        }
    }

    /**
     * DOM元素转Markdown（基础实现）
     */
    private elementToMarkdown(element: Element | null): string {
        if (!element) return '';

        // 简单转换逻辑，可根据需要扩展
        return Array.from(element.children)
            .map(child => {
                if (child.tagName === 'P') return child.textContent + '\n\n';
                if (child.tagName === 'STRONG') return `**${child.textContent}**`;
                return child.textContent;
            })
            .join('')
            .trim();
    }

    /**
     * 获取聊天记录的唯一标识ID
     */
    getChatId(): string {
        this.validateElement();
        return this._element.dataset.convId || '';
    }

    /**
     * 增强版回答完成检测
     */
    isAnswerDone(): boolean {
        // 双重验证机制确保可靠性
        return this._element.querySelector('.agent-chat__conv--ai__toolbar .agent-chat__toolbar__item.agent-chat__toolbar__repeat') !== null &&
            this._element.querySelector('.hyc-component-reasoner__text')?.textContent?.trim() !== '';
    }

}