// /**
//  * 下方的输入面板中的模型选择的下拉框
//  */
// export default class TencentYuanBaoInputBoardModelSelect {
//
//     public static MODEL_NAME_DEEPSEEK = "DeepSeek";
//
//     public static MODEL_NAME_HUNYUAN = "Hunyuan";
//
//     /**
//      * 切换为DeepSeek R1模型
//      */
//     chooseDeepSeekModel() {
//         if (this.getCurrentSelectedModelName() === TencentYuanBaoInputBoardModelSelect.MODEL_NAME_DEEPSEEK) {
//             return;
//         }
//
//         // 单击展开下拉框
//         const element = document.querySelector("[dt-page-id=YuanAgentPage]");
//         if (!element) {
//             return;
//         }
//         (element as HTMLElement).click();
//
//         //
//         const elementNodeListOf = document.querySelectorAll(".t-dropdown__item.t-dropdown__item--theme-default");
//
//     }
//
//     /**
//      * 切换为元宝模型
//      */
//     chooseYuanBaoModel() {
//         // TODO 2025-02-20 23:57:41 选择混元模型
//         // document.querySelectorAll(".t-dropdown__item.t-dropdown__item--theme-default")[0].querySelector(".t-dropdown__item-text").click();document.
//     }
//
//     /**
//      * 获取当前选中的模型的名称
//      *
//      * @private
//      */
//     private getCurrentSelectedModelName() {
//         const element = document.querySelector("[dt-page-id=YuanAgentPage]");
//         return element?.textContent;
//     }
//
// }