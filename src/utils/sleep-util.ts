/**
 * 异步休眠函数
 * @param ms 休眠时间（毫秒）
 * @returns Promise<void>
 *
 * @example
 * // 在async函数中使用
 * async function demo() {
 *   console.log('开始');
 *   await sleep(2000); // 暂停2秒
 *   console.log('2秒后执行');
 * }
 */
export default async function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}