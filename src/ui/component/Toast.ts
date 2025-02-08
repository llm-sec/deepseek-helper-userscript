/**
 * 提示框工具类
 * 提供静态方法调用的提示框功能
 */
export default class Toast {
    private static styleElement?: HTMLStyleElement;

    /**
     * 初始化样式（惰性加载）
     */
    private static ensureStylesInjected(): void {
        if (!Toast.styleElement) {
            const style = document.createElement('style');
            style.textContent = `
                .custom-tip {
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #4CAF50;
                    color: white;
                    padding: 15px 25px;
                    border-radius: 25px;
                    box-shadow: 0 3px 6px rgba(0,0,0,0.16);
                    opacity: 0;
                    animation: fadeIn 0.3s forwards;
                    z-index: 1000;
                }

                @keyframes fadeIn {
                    to { opacity: 1; }
                }

                .fade-out {
                    animation: fadeOut 0.3s forwards !important;
                }

                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
            Toast.styleElement = style;
        }
    }

    /**
     * 显示提示框
     * @param text 提示文字
     * @param duration 显示持续时间（毫秒），默认3000
     */
    public static show(text: string, duration: number = 3000): void {
        Toast.ensureStylesInjected();
        const tip = Toast.createTipElement(text);
        Toast.setupAutoClose(tip, duration);
    }

    /**
     * 创建提示框元素
     */
    private static createTipElement(text: string): HTMLElement {
        const tip = document.createElement('div');
        tip.className = 'custom-tip';
        tip.textContent = text;
        document.body.appendChild(tip);
        return tip;
    }

    /**
     * 设置自动关闭逻辑
     */
    private static setupAutoClose(element: HTMLElement, duration: number): void {
        setTimeout(() => {
            element.classList.add('fade-out');
            element.addEventListener('animationend', () => {
                element.remove();
            }, { once: true });
        }, duration);
    }
}

// 使用示例：
// Tips.show('操作成功！');
// Tips.show('文件已上传', 5000);