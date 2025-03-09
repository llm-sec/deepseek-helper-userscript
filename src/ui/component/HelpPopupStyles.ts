// FloatingBallStyles.ts
/**
 * 浮动球组件样式管理类
 * 负责动态注入和移除悬浮球组件相关样式
 */
export default class FloatingBallStyles {

    private styleElement: HTMLStyleElement;

    constructor() {
        // 创建style元素并设置唯一标识
        this.styleElement = document.createElement('style');
        this.styleElement.id = 'floatingBallStyles';

        // 移除已存在的样式元素避免重复
        const existingStyle = document.getElementById('floatingBallStyles');
        if (existingStyle) {
            existingStyle.remove();
        }

        // 定义悬浮球组件的所有CSS样式
        this.styleElement.textContent = `
      /* 悬浮球容器样式 */
      .floating-ball-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        transition: all 0.3s ease;
      }

      /* 悬浮球主体样式 */
      .floating-ball {
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(79, 172, 254, 0.3);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        font-size: 24px;
        font-weight: 300;
      }

      /* 悬浮球悬停效果 */
      .floating-ball:hover {
        transform: scale(1.1) rotate(180deg);
        box-shadow: 0 6px 25px rgba(79, 172, 254, 0.5);
      }

      /* 悬浮菜单容器样式 */
      .floating-menu {
        opacity: 0;
        visibility: hidden;
        position: absolute;
        bottom: calc(100% + 5px);
        right: 0;
        list-style: none;
        padding: 0;
        margin: 0;
        width: 160px;
        height: 160px;
        transition: opacity 0.3s ease, visibility 0.3s ease;
        pointer-events: none;
      }

      /* 扇形展开菜单项 */
      .floating-menu-item {
        width: 50px;
        height: 50px;
        background: linear-gradient(45deg, #4facfe, #00f2fe);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;
        pointer-events: auto;
        color: white;
        font-size: 14px;
        border: 2px solid rgba(255,255,255,0.2);
        backdrop-filter: blur(4px);
      }

      /* 调整展开方向为紧凑扇形 */
      .floating-menu.active .floating-menu-item:nth-child(1) {
        transform: rotate(-135deg) translate(70px) rotate(135deg);
        opacity: 1;
      }
      .floating-menu.active .floating-menu-item:nth-child(2) {
        transform: translateY(-80px);
        opacity: 1;
      }
      .floating-menu.active .floating-menu-item:nth-child(3) {
        transform: rotate(-225deg) translate(70px) rotate(225deg);
        opacity: 1;
      }

      /* 菜单项悬停效果 */
      .floating-menu-item:hover {
        transform: scale(1.2) !important;
        background: linear-gradient(45deg, #3a8fd9, #00c8e5);
        box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
        z-index: 1;
      }

      /* 弹窗蒙版样式 */
      .popup-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        backdrop-filter: blur(2px);
      }

      /* 弹窗主体样式 */
      .floating-popup {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        border-radius: 12px;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        width: 600px;
        max-height: 80vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      /* 弹窗内容区域样式 */
      .popup-content {
        padding: 24px;
        min-height: 200px;
        position: relative;
      }

      /* 关闭按钮样式 */
      .popup-close {
        position: absolute;
        top: 16px;
        right: 16px;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        background: #f5f5f5;
      }

      /* 关闭按钮悬停效果 */
      .popup-close:hover {
        background: #e0e0e0;
        transform: rotate(90deg);
      }

      /* 以下为各功能区域的具体样式配置 */
      .popup-content h3 {
        margin: 0 0 24px;
        font-size: 18px;
        color: #333;
      }

      /* 设置区块样式 */
      .setting-section {
        margin: 16px 0;
      }

      .setting-section label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: #666;
      }

      /* 自定义下拉框样式 */
      .custom-select {
        position: relative;
        width: 100%;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        background: #fff;
        transition: border-color 0.2s;
      }

      /* 下拉框动效 */
      .custom-select select {
        width: 100%;
        padding: 12px 40px 12px 16px;
        border: none;
        background: transparent;
        appearance: none;
        font-size: 14px;
        color: #333;
      }

      /* 下拉箭头样式 */
      .custom-select::after {
        content: '⌄';
        position: absolute;
        top: 50%;
        right: 16px;
        transform: translateY(-50%);
        color: #666;
        pointer-events: none;
      }

      /* 时间配置区域样式 */
      .time-config {
        display: grid;
        grid-template-columns: 100px 1fr;
        gap: 12px;
        align-items: center;
        margin-top: 16px;
      }

      /* 输入框样式 */
      .time-input {
        padding: 12px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        font-size: 14px;
        transition: border-color 0.2s;
      }

      /* 渐现动画 */
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;

        // 将样式注入文档头部
        document.head.appendChild(this.styleElement);
    }

    /**
     * 移除组件样式
     */
    public removeStyles(): void {
        document.head.removeChild(this.styleElement);
    }
}