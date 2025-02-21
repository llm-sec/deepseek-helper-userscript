import logger from "../../logger/Logger";

/**
 * 腾讯元宝页面下载App广告处理模块
 *
 * @class TencentYuanBaoDownloadApp
 * @description 用于处理腾讯元宝页面右下角的"下载App"浮动广告交互
 *
 * @example
 * // 使用示例
 * const adHandler = new TencentYuanBaoDownloadApp();
 * await adHandler.close();
 *
 * @remarks
 * 注意事项：
 * - 依赖于页面DOM结构稳定性，若选择器变更需要同步更新
 * - 关闭操作会直接删除DOM元素而非触发关闭动画
 */
export default class TencentYuanBaoDownloadApp {

    /**
     * 关闭下载App广告
     *
     * @method waitForClose
     * @description 通过持续监测并删除广告元素来隐藏下载App的广告浮层，最多等待一分钟
     *
     * @returns {Promise<void>} 异步操作Promise
     *
     * @example
     * // 典型用法
     * await TencentYuanBaoDownloadApp.waitForClose();
     *
     * @remarks
     * 实现细节：
     * - 使用CSS选择器".agent-dialogue__content-qrcode"定位广告容器
     * - 采用轮询机制每100ms检查元素存在性
     * - 发现元素立即删除并退出，最长等待60秒
     */
    static async waitForClose() {
        const timeout = 60000; // 一分钟超时
        const checkInterval = 100; // 检查间隔100毫秒
        const startTime = Date.now();

        while (Date.now() - startTime < timeout) {
            const element = document.querySelector('.agent-dialogue__content-qrcode');
            if (element) {
                element.remove();
                logger.info("已成功删除下载App广告");
                return;
            }
            await new Promise(resolve => setTimeout(resolve, checkInterval));
        }

        logger.error("等待广告元素超时，未找到元素");
    }

}