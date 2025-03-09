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
     * 增强版智能元素定位（支持Shadow DOM和iframe）
     * @private
     */
    private async locateElement(
        selector: string | Element,
        description?: string
    ): Promise<Element> {
        const maxRetry = this.options.retryCount;
        const desc = description || (typeof selector === 'string' ? selector : '元素');
        const startTime = Date.now();

        // 增强型选择器查询（支持Shadow DOM）
        const deepQuerySelector = (root: Document | ShadowRoot, selector: string): Element | null => {
            const result = root.querySelector(selector);
            if (result) return result;

            // 递归搜索Shadow DOM
            const shadows = Array.from(root.querySelectorAll('*'))
                .filter(el => el.shadowRoot)
                .map(el => el.shadowRoot as ShadowRoot);

            for (const shadow of shadows) {
                const found = deepQuerySelector(shadow, selector);
                if (found) return found;
            }

            // 搜索iframe内容
            const frames = Array.from(root.querySelectorAll('iframe'))
                .map(frame => {
                    try {
                        return frame.contentDocument;
                    } catch (e) {
                        return null;
                    }
                })
                .filter(Boolean) as Document[];

            for (const frameDoc of frames) {
                const found = deepQuerySelector(frameDoc, selector);
                if (found) return found;
            }

            return null;
        };

        for (let i = 0; i < maxRetry; i++) {
            const element = typeof selector === 'string'
                ? deepQuerySelector(document, selector)
                : selector;

            if (element?.isConnected) { // 验证元素是否仍在DOM中
                this.log(`成功定位到 ${desc} (耗时 ${Date.now() - startTime}ms)`);
                return element;
            }

            const nextInterval = this.calculateDynamicInterval(i);
            this.log(`第 ${i + 1}/${maxRetry} 次尝试定位 ${desc}，下次重试 ${nextInterval}ms`);
            await this.delay(nextInterval);
        }

        // 最终失败时生成诊断信息
        const diagnostics = this.generateDiagnostics(selector);
        throw new Error(`无法定位元素: ${desc}\n诊断信息: ${diagnostics}`);
    }

    /**
     * 动态计算重试间隔（指数退避 + 随机抖动）
     * @private
     */
    private calculateDynamicInterval(attempt: number): number {
        const base = this.options.retryInterval;
        const maxJitter = base * 0.3; // 30%抖动
        return Math.min(
            base * Math.pow(2, attempt) + Math.random() * maxJitter,
            5000 // 最大间隔5秒
        );
    }

    /**
     * 生成元素诊断信息
     * @private
     */
    private generateDiagnostics(selector: string | Element): string {
        if (typeof selector !== 'string') return '';

        const similarElements = Array.from(document.querySelectorAll('*'))
            .filter(el => {
                const classes = Array.from(el.classList);
                return classes.some(c => c.includes('qrcode')) ||
                    el.id.includes('qrcode') ||
                    el.tagName.toLowerCase().includes('qrcode');
            })
            .slice(0, 5)
            .map(el => {
                const info = [];
                if (el.id) info.push(`id="${el.id}"`);
                if (el.className) info.push(`class="${el.className}"`);
                return `${el.tagName} (${info.join(' ')})`;
            });

        return [
            `可能原因：`,
            `1. 元素加载延迟超过 ${this.options.retryCount * this.options.retryInterval}ms`,
            `2. 选择器书写错误（当前使用："${selector}"）`,
            `3. 元素位于Shadow DOM或iframe中`,
            `4. 元素已被动态移除`,
            `相似元素（前5个）：${similarElements.join(' | ') || '无'}`
        ].join('\n');
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

    /**
     * 高级元素等待点击（支持MutationObserver监听）
     * @param selector 目标元素选择器
     * @param options 配置项
     * @returns 返回清理观察器的函数（可手动终止等待）
     */
    public waitForClick(
        selector: string,
        options: {
            timeout?: number;
            matchType?: 'css' | 'xpath' | 'text';
            clickOptions?: {
                button?: number;
                moveDelay?: number;
                clickDelay?: number;
            };
            observerConfig?: MutationObserverInit;
        } = {}
    ): Promise<Element> {
        const {
            timeout = 30_000,
            matchType = 'css',
            clickOptions = {},
            observerConfig = {
                childList: true,
                subtree: true,
                attributes: true, // 增加属性变化监听
                attributeFilter: ['class', 'style'] // 关键属性过滤
            }
        } = options;

        return new Promise((resolve, reject) => {
            const controller = new AbortController();
            const timer = setTimeout(() => {
                controller.abort();
                reject(new Error(`等待元素超时: ${selector} (${timeout}ms)`));
            }, timeout);

            // 双重检测机制：立即检查 + Mutation监听
            const directCheck = () => {
                const el = this.findElementByType(selector, matchType);
                if (el) {
                    safeClick(el);
                    return true;
                }
            };

            // 安全点击封装
            const safeClick = async (el: Element) => {
                try {
                    if (clickOptions.moveDelay) await this.delay(clickOptions.moveDelay);
                    await this.moveTo(el);
                    if (clickOptions.clickDelay) await this.delay(clickOptions.clickDelay);
                    await this.click(el, clickOptions.button);
                    resolve(el);
                } catch (e) {
                    reject(e);
                }
            };

            // 首次直接检测
            if (directCheck()) {
                clearTimeout(timer);
                return;
            }

            // MutationObserver监听
            const observer = new MutationObserver((mutations) => {
                if (controller.signal.aborted) return;
                if (directCheck()) {
                    observer.disconnect();
                    clearTimeout(timer);
                }
            });

            // 事件监听作为后备方案
            // 扩展事件类型
            const eventTypes = [
                'click', 'keydown', 'mousemove', 'scroll',
                'resize', 'touchstart', 'touchend'
            ];
            const eventHandler = () => {
                if (controller.signal.aborted) return;
                if (directCheck()) {
                    eventTypes.forEach(t => document.removeEventListener(t, eventHandler));
                    clearTimeout(timer);
                }
            };

            // 启动监听
            observer.observe(document.documentElement, observerConfig);
            eventTypes.forEach(t => document.addEventListener(t, eventHandler));

            // 清理逻辑
            controller.signal.addEventListener('abort', () => {
                observer.disconnect();
                eventTypes.forEach(t => document.removeEventListener(t, eventHandler));
            });
        });
    }

    /**
     * 多模式元素查找
     * @private
     */
    private findElementByType(selector: string, type: string): Element | null {
        switch (type) {
            case 'xpath':
                return document.evaluate(
                    selector,
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue as Element;
            case 'text':
                return Array.from(document.querySelectorAll('*'))
                    .find(el => el.textContent?.trim() === selector) || null;
            default:
                return document.querySelector(selector);
        }
    }

}