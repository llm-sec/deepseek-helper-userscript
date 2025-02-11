/**
 * 应用初始化模块
 *
 * 此模块负责整合并执行应用启动时所需的各项初始化任务
 * 通过统一入口管理初始化流程，确保启动顺序和依赖关系
 */

import runCrazyRetry from "../crazy-retry/crazy-retry";
import logger, {LogLevel} from "../logger/Logger";
import FloatingBall from "../ui/component/FloatingBall";

/**
 * 应用主初始化函数
 *
 * @async
 * @function
 * @description 执行核心初始化流程，当前包含：
 * - 异常重试机制初始化
 *
 * @example
 * // 在应用启动入口调用
 * import init from './init/init';
 * await init();
 *
 * @returns {Promise<void>} 初始化完成Promise
 */
export default async function init() {

    logger.configure({
        level: LogLevel.DEBUG,
        enableColors: false
    });

    setTimeout(() => {
        new FloatingBall();
    }, 1000);

    // 初始化异常重试机制
    // 配置全局请求失败时的重试策略
    await runCrazyRetry();

    // 可在此处添加其他初始化任务
    // 例如：await initLogger();
    //      await initAnalytics();
}