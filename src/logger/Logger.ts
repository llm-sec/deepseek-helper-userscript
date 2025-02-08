// Logger.ts

/**
 * 日志级别枚举
 * DEBUG < INFO < WARN < ERROR < NONE
 */
enum LogLevel {
    DEBUG = 0,   // 调试信息
    INFO = 1,    // 常规信息
    WARN = 2,    // 警告信息
    ERROR = 3,   // 错误信息
    NONE = 4     // 关闭所有日志
}

/**
 * 日志配置选项类型
 */
type LoggerOptions = {
    level?: LogLevel;          // 日志级别阈值
    enableTimestamp?: boolean; // 是否显示时间戳
    enableColors?: boolean;    // 是否启用颜色
};

// 默认配置选项
const DEFAULT_OPTIONS: Required<LoggerOptions> = {
    level: LogLevel.DEBUG,
    enableTimestamp: true,
    enableColors: true,
};

/**
 * 浏览器环境日志记录器
 * 功能特性：
 * - 分级日志输出
 * - 颜色区分级别
 * - 动态配置
 * - 保留原始调用堆栈
 */
class Logger {
    // 当前配置（合并默认值和自定义值）
    private options: Required<LoggerOptions>;

    // 各日志级别的CSS样式配置
    private colorStyles: Record<LogLevel, string> = {
        [LogLevel.DEBUG]: 'color: #666; background-color: #f0f0f0',
        [LogLevel.INFO]: 'color: #1e88e5; background-color: #e3f2fd',
        [LogLevel.WARN]: 'color: #ffa000; background-color: #fff3e0',
        [LogLevel.ERROR]: 'color: #d32f2f; background-color: #ffebee',
        [LogLevel.NONE]: '' // NONE级别不需要样式
    };

    constructor(options: LoggerOptions = {}) {
        this.options = { ...DEFAULT_OPTIONS, ...options };
    }

    // 设置日志级别
    setLevel(level: LogLevel): void {
        this.options.level = level;
    }

    // 动态更新配置
    configure(options: Partial<LoggerOptions>): void {
        this.options = { ...this.options, ...options };
    }

    // 调试日志
    debug(...args: unknown[]): void {
        this.log(LogLevel.DEBUG, args);
    }

    // 信息日志
    info(...args: unknown[]): void {
        this.log(LogLevel.INFO, args);
    }

    // 警告日志
    warn(...args: unknown[]): void {
        this.log(LogLevel.WARN, args);
    }

    // 错误日志
    error(...args: unknown[]): void {
        this.log(LogLevel.ERROR, args);
    }

    // 获取ISO格式时间戳
    private getTimestamp(): string {
        return new Date().toISOString();
    }

    // 获取日志级别标签
    private getLabel(level: LogLevel): string {
        const labels: Record<LogLevel, string> = {
            [LogLevel.DEBUG]: 'DEBUG',
            [LogLevel.INFO]: 'INFO',
            [LogLevel.WARN]: 'WARN',
            [LogLevel.ERROR]: 'ERROR',
            [LogLevel.NONE]: 'NONE'
        };
        return labels[level] || 'LOG';
    }

    /**
     * 核心日志方法
     * @param level 日志级别
     * @param args 日志参数
     */
    private log(level: LogLevel, args: unknown[]): void {
        // 过滤低于当前级别的日志
        if (level < this.options.level) return;

        const label = this.getLabel(level);
        const timestamp = this.options.enableTimestamp ? `${this.getTimestamp()} ` : '';
        const styles = this.options.enableColors
            ? this.colorStyles[level as Exclude<LogLevel, LogLevel.NONE>]
            : '';

        // 构造格式化参数，保留原始调用堆栈
        const formattedArgs = [
            `%c${timestamp}${label}:`, // 带样式的首参数
            styles,                    // CSS样式
            ...args                    // 原始日志内容
        ];

        // 根据级别调用对应的console方法
        switch (level) {  // ✅ 正确变量名（小写level）
            case LogLevel.DEBUG:
                console.debug(...formattedArgs);  // ✅ 正确方法名和变量名
                break;
            case LogLevel.INFO:  // ✅ 正确枚举值
                console.info(...formattedArgs);
                break;
            case LogLevel.WARN:
                console.warn(...formattedArgs);  // ✅ 正确方法名
                break;
            case LogLevel.ERROR:
                console.error(...formattedArgs);
                break;
            default:
                // 穷举检查确保处理所有枚举值
                console.info(...formattedArgs);
                break;
        }
    }
}

// 导出默认单例实例
const logger = new Logger();

export { Logger, LogLevel, logger as default };

/* 使用示例：
// 基础使用
logger.debug('User login', { username: 'alice' });
logger.info('API response', responseData);
logger.warn('Deprecation warning');
logger.error('Network error', error);

// 生产环境配置
logger.configure({
  level: LogLevel.ERROR,
  enableColors: false
});

// 自定义实例
const customLogger = new Logger({
  enableTimestamp: false,
  level: LogLevel.WARN
});
*/