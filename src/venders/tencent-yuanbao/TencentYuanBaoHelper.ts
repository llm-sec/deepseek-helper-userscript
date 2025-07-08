import TencentYuanBaoChatStatusMonitor from "./TencentYuanBaoChatStatusMonitor";
import logger from "../../logger/Logger";
import TencentYuanBaoDownloadApp from "./TencentYuanBaoDownloadApp";

/**
 * 辅助使用腾讯元宝
 */
export default class TencentYuanBaoHelper {

    /**
     * 初始化
     */
    static async init() {
        logger.info("开始初始化腾讯元宝问答助手");
        TencentYuanBaoChatStatusMonitor.run();
        TencentYuanBaoDownloadApp.waitForClose();
    }

}