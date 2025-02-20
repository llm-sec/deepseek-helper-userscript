/**
 * 应用初始化模块
 *
 * 此模块负责整合并执行应用启动时所需的各项初始化任务
 * 通过统一入口管理初始化流程，确保启动顺序和依赖关系
 */

import runCrazyRetry from "../crazy-retry/crazy-retry";
import logger, {LogLevel} from "../logger/Logger";
import FloatingBall from "../ui/component/FloatingBall";
import TencentYuanBaoHelper from "../venders/tencent-yuanbao/TencentYuanBaoHelper";

// 初始化配置类型
interface InitConfig {
    logLevel?: LogLevel;
    enableColors?: boolean;
    enableFloatingBall?: boolean;
}

// 域名功能映射
const DOMAIN_FEATURES: Record<string, (config: InitConfig) => Promise<void>> = {
    'example.com': async (config) => {
        // 示例域名的特殊初始化逻辑
        config.enableFloatingBall = true;
        // await import('../features/example-feature').then(m => m.init());
    },
    'yuanbao.tencent.com': async (config) => {
        // 管理后台的特殊初始化
        config.logLevel = LogLevel.DEBUG;
        config.enableColors = true;
        await TencentYuanBaoHelper.init();
    }
};

/**
 * 核心初始化任务清单
 */
const CORE_INIT_TASKS = [
    // 第一阶段：基础配置
    async (config: InitConfig) => {
        logger.configure({
            level: config.logLevel || LogLevel.DEBUG,
            enableColors: config.enableColors ?? true
        });
        logger.debug('日志系统初始化完成');
    },

    // 第二阶段：UI组件初始化
    async (config: InitConfig) => {
        if (config.enableFloatingBall) {
            await new Promise(resolve => {
                const ball = new FloatingBall();
                // ball.on('ready', resolve);
                setTimeout(resolve, 1000); // 超时保护
            });
            logger.debug('悬浮球初始化完成');
        }
    },

    // 第三阶段：核心功能初始化
    // async (config: InitConfig) => {
    //     await runCrazyRetry();
    //     logger.debug('异常重试机制初始化完成');
    // }
];

/**
 * 应用主初始化函数
 * @param userConfig 用户自定义配置（可选）
 */
export default async function init(userConfig?: InitConfig): Promise<void> {
    const config: InitConfig = {
        logLevel: LogLevel.DEBUG,
        enableColors: false,
        enableFloatingBall: true,
        ...userConfig
    };

    try {
        // 域名特性初始化
        const hostname = window.location.hostname;
        const domainInit = DOMAIN_FEATURES[hostname] || DOMAIN_FEATURES[hostname.replace(/^www\./, '')];

        if (domainInit) {
            logger.info(`检测到特殊域名 ${hostname}，执行定制初始化`);
            await domainInit(config);
        }

        // 执行核心初始化流程
        for (const [index, task] of CORE_INIT_TASKS.entries()) {
            try {
                await task(config);
                logger.debug(`初始化阶段 ${index + 1} 完成`);
            } catch (error) {
                logger.error(`初始化阶段 ${index + 1} 失败`, error);
                throw error;
            }
        }

        logger.info('应用初始化完成');
    } catch (error) {
        logger.error('应用初始化失败', error);
        throw new Error('应用初始化失败: ' + (error as Error).message);
    }
}

