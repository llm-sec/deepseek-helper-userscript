/**
 * 高级鼠标模拟工具类
 * 支持：精确定位、事件序列模拟、平滑移动、智能重试等特性
 *
 * 核心功能说明
 * 自然移动模拟：
 * 使用贝塞尔曲线生成拟人化移动轨迹
 * 支持30步动画过渡（可配置）
 * 自动计算元素中心点坐标
 *
 * <pre>
 *
 *     // 初始化
 * const mouse = new MouseSimulator({
 *   debug: true,
 *   humanize: true
 * });
 *
 * // 简单点击
 * await mouse.click('#submitButton');
 *
 * // 复杂拖拽
 * await mouse.drag(
 *   document.querySelector('.draggable'),
 *   { x: 500, y: 300 }
 * );
 *
 * // 右键菜单
 * await mouse.click('.context-menu', 2);
 *
 *     </pre>
 *
 */
export default class MouseSimulator {
    // 配置项
    private options: {
        debug: boolean;
        retryCount: number;
        retryInterval: number;
        humanize: boolean;
    };

    // 当前鼠标状态
    private state: {
        position: { x: number; y: number };
        isDragging: boolean;
        buttonState: number;
    };

    constructor(options: Partial<typeof MouseSimulator.prototype.options> = {}) {
        this.options = {
            debug: false,
            retryCount: 5,
            retryInterval: 300,
            humanize: true,
            ...options
        };

        this.state = {
            position: {x: 0, y: 0},
            isDragging: false,
            buttonState: 0
        };
    }

    /**
     * 核心事件派发器
     * @private
     */
    private dispatchEvent(
        target: Element,
        eventType: string,
        initArgs: MouseEventInit = {}
    ): boolean {
        const {position} = this.state;
        const fullInit: MouseEventInit = {
            bubbles: true,
            cancelable: true,
            clientX: position.x,
            clientY: position.y,
            ...initArgs,
            buttons: this.state.buttonState
        };

        const event = new MouseEvent(eventType, fullInit);

        // 移除isTrusted属性重定义逻辑
        // Object.defineProperty(event, 'isTrusted', {value: true});  // 这行是错误根源

        this.log(`派发 ${eventType} 事件在 (${position.x}, ${position.y})`);
        return target.dispatchEvent(event);
    }

    /**
     * 智能元素定位（带重试机制）
     * @private
     */
    private async locateElement(
        selector: string | Element,
        description?: string
    ): Promise<Element> {
        const maxRetry = this.options.retryCount;
        const desc = description || (typeof selector === 'string' ? selector : '元素');

        for (let i = 0; i < maxRetry; i++) {
            const element = typeof selector === 'string'
                ? document.querySelector(selector)
                : selector;

            if (element) {
                this.log(`成功定位到 ${desc}`);
                return element;
            }

            this.log(`第 ${i + 1}/${maxRetry} 次尝试定位 ${desc}`);
            await this.delay(this.options.retryInterval);
        }

        throw new Error(`无法定位元素: ${desc}`);
    }

    /**
     * 计算元素中心坐标
     * @private
     */
    private calculateElementCenter(element: Element): { x: number; y: number } {
        const rect = element.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }

    /**
     * 缓动函数
     * @private
     */
    private easeInOutQuad(t: number): number {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    /**
     * 执行点击事件序列
     * @private
     */
    private async performClickSequence(
        element: Element,
        button: number = 0
    ): Promise<void> {
        // 更新按钮状态
        this.state.buttonState = button === 0 ? 1 : 2;

        const events: Array<[string, MouseEventInit]> = [
            ['mousedown', {button}],
            ['mouseup', {button}],
            ['click', {button}]
        ];

        for (const [type, init] of events) {
            if (!this.dispatchEvent(element, type, init)) {
                throw new Error(`${type} 事件被阻止`);
            }
            await this.delay(50);
        }

        this.state.buttonState = 0;
    }

    /**
     * 执行点击操作
     * @param target 支持选择器、元素对象或坐标
     * @param button 0-左键 1-中键 2-右键
     */
    public async click(
        target: string | Element | { x: number; y: number } | null,
        button: number = 0
    ): Promise<void> {

        if (!target) {
            return;
        }

        let element: Element;

        if (typeof target === 'string' || target instanceof Element) {
            element = await this.locateElement(target);
        } else {
            element = document.elementFromPoint(target.x, target.y)!;
        }

        // 直接更新坐标但不触发移动事件
        const pos = target instanceof Element
            ? this.calculateElementCenter(element)
            : target;
        // this.state.position = pos;

        // 直接执行点击序列
        await this.performClickSequence(element, button);
    }

    // 禁用鼠标移动模拟
    private async humanizedMove(): Promise<void> {
        return Promise.resolve(); // 空实现
    }

    // 修改移动方法为直接更新坐标
    public async moveTo(target: Element | { x: number; y: number }): Promise<void> {
        const targetPos = target instanceof Element
            ? this.calculateElementCenter(target)
            : target;
        this.state.position = targetPos;
    }

    /**
     * 执行拖拽操作
     * @param from 起始位置
     * @param to 结束位置
     */
    public async drag(
        from: string | Element | { x: number; y: number },
        to: string | Element | { x: number; y: number }
    ): Promise<void> {
        // 处理起始位置
        let startElement: Element;
        let startPos: { x: number; y: number };
        if (typeof from === 'string' || from instanceof Element) {
            startElement = await this.locateElement(from);
            startPos = this.calculateElementCenter(startElement);
        } else {
            startPos = from;
            startElement = document.elementFromPoint(startPos.x, startPos.y)!;
            if (!startElement) {
                throw new Error(`无法在位置 (${startPos.x}, ${startPos.y}) 找到元素`);
            }
        }

        // 处理结束位置
        let endPos: { x: number; y: number };
        if (typeof to === 'string' || to instanceof Element) {
            const endElement = await this.locateElement(to);
            endPos = this.calculateElementCenter(endElement);
        } else {
            endPos = to;
        }

        // 开始拖拽
        await this.moveTo(startPos);
        await this.performClickSequence(startElement);
        this.state.isDragging = true;

        // 平滑移动
        await this.moveTo(endPos);

        // 释放
        const endElement = document.elementFromPoint(endPos.x, endPos.y)!;
        await this.performClickSequence(endElement);
        this.state.isDragging = false;
    }

    /**
     * 执行双击操作
     */
    public async doubleClick(target: string | Element): Promise<void> {
        const element = await this.locateElement(target);
        await this.moveTo(element);
        await this.performClickSequence(element);
        await this.delay(100);
        await this.performClickSequence(element);
    }

    /**
     * 工具方法：延迟执行
     */
    public delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 调试日志
     * @private
     */
    private log(...args: any[]): void {
        if (this.options.debug) {
            console.log('[MouseSimulator]', ...args);
        }
    }
}