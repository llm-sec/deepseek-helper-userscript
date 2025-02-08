/**
 * 判断指定元素是否在页面上可见
 * @param {Element} element - 需要检测的DOM元素
 * @returns {boolean} - 当元素满足所有可见条件时返回true，否则返回false
 *
 * 可见性判断标准：
 * 1. 元素必须是有效的HTMLElement
 * 2. 元素自身样式不为display:none或visibility:hidden
 * 3. 所有祖先元素均没有设置display:none或visibility:hidden
 * 4. 元素在视口范围内（根据getBoundingClientRect判断）
 *
 * 注意：本检测不包含以下情况：
 * - 透明度(opacity)为0的情况
 * - 元素被其他DOM节点遮挡的情况
 * - 浏览器窗口最小化/隐藏标签页等特殊情况
 *
 * @param element
 */
export default function isElementVisible(element: Element) {

    // 基础元素有效性验证
    // 确保输入是有效的HTML元素，SVG元素等特殊类型将在此处被过滤
    if (!element || !(element instanceof HTMLElement)) {
        console.warn("No valid element provided.");
        return false;
    }

    // 获取元素最终计算样式
    const style = window.getComputedStyle(element);

    // 元素自身可见性检测
    // display:none 会完全移除文档流中的元素
    // visibility:hidden 会使元素不可见但保留占位空间
    if (style.display === "none" || style.visibility === "hidden") {
        return false;
    }

    // 祖先元素链式检测
    // 遍历所有父级元素，确保没有祖先设置display:none或visibility:hidden
    // 注意：parentElement会跳过shadow DOM边界，需根据实际情况调整
    let parent = element.parentElement;
    while (parent) {
        const parentStyle = window.getComputedStyle(parent);
        // 任一祖先不可见即终止检测
        if (
            parentStyle.display === "none" ||
            parentStyle.visibility === "hidden"
        ) {
            return false;
        }
        parent = parent.parentElement;
    }

    // 视口位置检测
    // 通过元素边界矩形判断是否在可视区域内：
    // - 顶部超出视口下边界：rect.top > window.innerHeight
    // - 底部超出视口上边界：rect.bottom < 0
    // - 右侧超出视口左边界：rect.right < 0
    // - 左侧超出视口右边界：rect.left > window.innerWidth
    const rect = element.getBoundingClientRect();
    if (
        rect.top > window.innerHeight ||   // 元素在视口下方不可见
        rect.bottom < 0 ||                 // 元素在视口上方不可见
        rect.right < 0 ||                  // 元素在视口左侧不可见
        rect.left > window.innerWidth      // 元素在视口右侧不可见
    ) {
        return false;
    }

    // 通过所有检测条件，判定为可见
    return true;
}