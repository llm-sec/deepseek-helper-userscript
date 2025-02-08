// [file name]: Session.ts
import AnswertElement from "./AnswertElement";

/**
 * 会话元素管理类
 * 处理当前会话中回答元素的定位和操作
 */
export default class SessionElement {

    /**
     * 查找最近生成的回答元素
     * @returns 最新回答元素的封装对象，找不到返回null
     */
    findLastAnswerElement() {
        // 通过DOM层级关系定位回答元素（依赖当前DOM结构）
        const refreshBtn = this.findLastRefreshIcon();
        const answerElement = refreshBtn?.parentElement?.parentElement?.parentElement;
        return answerElement ? new AnswertElement(answerElement) : null;
    }

    /**
     * 查找最后一个刷新按钮元素
     * @private
     * @returns 包含#重新生成子元素的按钮，找不到返回null
     */
    private findLastRefreshIcon() {
        // 获取所有候选按钮元素
        const elements = document.querySelectorAll('.ds-icon-button');

        // 逆向遍历查找最新元素（从最后元素开始）
        for (let i = elements.length - 1; i >= 0; i--) {
            const element = elements[i];
            // 通过ID选择器验证按钮功能
            if (element.querySelector('#重新生成')) {
                return element;
            }
        }
        return null;
    }

}