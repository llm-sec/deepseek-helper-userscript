// FloatingBallStyles.ts
export default class FloatingBallStyles {
    private styleElement: HTMLStyleElement;

    constructor() {
        this.styleElement = document.createElement('style');
        this.styleElement.id = 'floatingBallStyles';
        this.styleElement.textContent = this.generateStyles();
        document.head.appendChild(this.styleElement);
    }

    private generateStyles(): string {
        return `
      .floating-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
      }

      .floating-ball {
        width: 56px;
        height: 56px;
        background: #2196F3;
        border-radius: 50%;
        position: relative;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(33, 150, 243, 0.25);
        transition: all 0.28s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }

      .floating-ball::before,
      .floating-ball::after {
        content: '';
        position: absolute;
        background: white;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        transition: transform 0.3s ease;
      }

      .floating-ball::before {
        width: 24px;
        height: 2px;
      }

      .floating-ball::after {
        width: 2px;
        height: 24px;
      }

      .floating-ball:hover {
        transform: scale(1.0714);
        box-shadow: 0 6px 16px rgba(33, 150, 243, 0.3);
      }

      .floating-ball.active::before,
      .floating-ball.active::after {
        transform: translate(-50%, -50%) rotate(225deg);
      }

      .floating-menu {
        position: fixed;
        bottom: 20px;
        right: 20px;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.28s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }

      .floating-menu.active {
        opacity: 1;
        pointer-events: auto;
      }

      .floating-menu-item {
        position: absolute;
        width: 48px;
        height: 48px;
        background: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
        cursor: pointer;
        opacity: 0;
        transform: translate(0, 0);
        transition: all 0.28s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }

      .floating-menu.active .floating-menu-item {
        opacity: 1;
      }

      .floating-menu-item:hover {
        transform: translateY(-4px) !important;
        box-shadow: 0 5px 12px rgba(0, 0, 0, 0.2);
      }

      .floating-menu-item:active {
        transform: scale(0.9) !important;
      }

      .menu-item-label {
        position: absolute;
        left: 60px;
        background: white;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 14px;
        white-space: nowrap;
        opacity: 0;
        transform: translateX(-10px);
        transition: all 0.2s ease;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      }

      .floating-menu-item:hover .menu-item-label {
        opacity: 1;
        transform: translateX(0);
      }

      @keyframes ripple {
        from {
          transform: scale(0);
          opacity: 1;
        }
        to {
          transform: scale(2);
          opacity: 0;
        }
      }

      .floating-menu-item::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.1);
        opacity: 0;
      }

      .floating-menu-item:active::after {
        animation: ripple 0.4s ease-out;
      }

      .floating-menu-item i {
        font-size: 24px;
      }
    `;
    }

    public removeStyles(): void {
        document.head.removeChild(this.styleElement);
    }
}