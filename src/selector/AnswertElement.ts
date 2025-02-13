// [file name]: AnswertElement.ts
/**
 * 回答元素封装类
 * 封装单个回答元素的DOM操作和状态判断
 */
export default class AnswertElement {
    /**
     * 绑定的回答元素DOM节点
     */
    answerElement: HTMLElement

    /**
     * 构造函数
     * @param answerElement - 需要封装的回答元素DOM节点
     */
    constructor(answerElement: HTMLElement) {
        this.answerElement = answerElement;
    }

    /**
     * 判断当前回答是否显示服务器繁忙状态
     * @returns 当回答内容包含"服务器繁忙，请稍后再试。"时返回true
     */
    isServerBusy() {
        // 通过特定class选择器定位内容区域
        const content = this.answerElement.querySelector(".ds-markdown");
        const chineseBusy = "服务器繁忙，请稍后再试。";
        const englishBusy = "The server is busy. Please try again later.";
        const contentText = content?.textContent?.trim();
        return contentText == chineseBusy || contentText == englishBusy;
    }

    /**
     * 点击当前回答的刷新按钮
     * @returns 找到并点击按钮返回true，否则返回false
     */
    clickRefreshBtn() {
        // 在当前回答元素范围内搜索按钮（限定查找范围避免干扰其他会话）
        const buttons = this.answerElement.querySelectorAll('.ds-icon-button');

        // 逆向遍历查找最新按钮（从最后元素开始）
        for (let i = buttons.length - 1; i >= 0; i--) {
            const btn = buttons[i];
            if (btn.querySelector('#重新生成')) {
                // 执行点击操作
                (btn as HTMLElement).click();
                return true;
            }
        }
        return false;
    }
}