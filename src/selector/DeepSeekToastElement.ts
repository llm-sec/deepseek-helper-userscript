// [file name]: DeepSeekToastElement.ts
import sleep from "../utils/sleep-util";

/**
 * Toast提示元素封装类
 * 用于操作和管理DeepSeek系统中的Toast提示组件
 */
export default class DeepSeekToastElement {
    /**
     * 绑定的Toast元素DOM节点
     */
    toastElement: HTMLElement;

    /**
     * 构造函数
     * @param toastElement - 需要封装的Toast元素DOM节点
     */
    constructor(toastElement: HTMLElement) {
        this.toastElement = toastElement;
    }

    /**
     * 捕获Toast元素（带超时的轮询方法）
     * @param timeoutMs - 最大等待时间（毫秒）
     * @returns Promise<DeepSeekToastElement | null> 成功捕获返回实例，超时返回null
     *
     * @example
     * // 等待最多3秒捕获Toast
     * const toast = await DeepSeekToastElement.captureDeepSeekToast(3000);
     * if(toast?.isTooFast()) {
     *   // 处理频率过高情况
     * }
     */
    static async captureDeepSeekToast(timeoutMs: number): Promise<DeepSeekToastElement | null> {
        const startTs = Date.now();
        while (Date.now() - startTs < timeoutMs) {
            // 通过复合选择器定位完整Toast容器
            const element = document.querySelector(".ds-toast__content");
            if (element?.parentElement) {
                return new DeepSeekToastElement(element.parentElement);
            }
            // 每100ms轮询一次以平衡性能与响应速度
            await sleep(100);
        }
        return null;
    }

    /**
     * 获取弹窗内容
     */
    getContent(): string {
        return this.toastElement.querySelector(".ds-toast__content")?.textContent?.trim() || "";
    }

    /**
     * 判断是否为"发送频率过快"提示
     * @returns 当Toast内容匹配预设文案时返回true
     */
    isTooFast(): boolean {
        // 精确匹配系统预设提示文案
        return this.getContent() === "你发送消息的频率过快，请稍后再发";
    }

}