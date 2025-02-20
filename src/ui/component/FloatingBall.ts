// FloatingBall.ts
import FloatingBallStyles from "./FloatingBallStyles";
import { SettingsPopup } from "./SettingsPopup";
import HelpPopup from "./HelpPopup";
import AboutPopup from "./AboutPopup";
import SharePopup from "./SharePopup"; // 新增引入

/**
 * 浮动球主功能类
 * 实现悬浮球交互功能和弹窗管理
 */
export default class FloatingBall {

    // DOM元素引用
    private container: HTMLElement;
    private ball: HTMLElement;
    private menu: HTMLElement;
    private items: HTMLElement[] = [];

    // 状态管理
    private isMenuOpen: boolean;
    private timer: any; // 菜单隐藏计时器

    constructor() {
        // 初始化状态
        this.isMenuOpen = false;

        // 创建容器元素
        this.container = document.createElement('div');
        this.container.className = 'floating-ball-container';

        // 创建悬浮球和菜单
        this.ball = this.createBall();
        this.menu = this.createMenu();

        // 组装DOM结构
        this.container.appendChild(this.ball);
        this.container.appendChild(this.menu);
        document.body.appendChild(this.container);

        // 绑定交互事件
        this.ball.addEventListener('mouseenter', this.toggleMenu.bind(this));
        this.ball.addEventListener('mouseleave', this.delayHideMenu.bind(this));
        this.menu.addEventListener('mouseenter', this.cancelHideMenu.bind(this));
        this.menu.addEventListener('mouseleave', this.delayHideMenu.bind(this));

        // 菜单项点击处理
        this.items.forEach(item => {
            item.addEventListener('click', this.handleClickMenuItem.bind(this));
        });

        // 初始化样式
        new FloatingBallStyles();
    }

    /**
     * 创建悬浮球元素
     */
    private createBall(): HTMLElement {
        const ball = document.createElement('div');
        ball.className = 'floating-ball';
        ball.innerHTML = '+'; // 中心符号
        return ball;
    }

    /**
     * 创建悬浮菜单
     */
    private createMenu(): HTMLElement {
        const menu = document.createElement('ul');
        menu.className = 'floating-menu';

        // 菜单项配置
        const menuItems = ['设置', '帮助', '关于', '分享'];
        this.items = menuItems.map(itemText => {
            const menuItem = document.createElement('li');
            menuItem.className = 'floating-menu-item';
            menuItem.textContent = itemText;
            return menuItem;
        });

        // 添加菜单项
        this.items.forEach(item => menu.appendChild(item));
        return menu;
    }

    /**
     * 切换菜单显示状态
     */
    private toggleMenu(): void {
        if (!this.isMenuOpen) {
            this.menu.style.opacity = '1';
            this.menu.style.visibility = 'visible';
            this.menu.style.transform = 'translateX(-50%) translateY(0)'; // 垂直居中动画
            this.isMenuOpen = true;
        }
    }

    /**
     * 取消隐藏菜单
     */
    private cancelHideMenu(): void {
        clearTimeout(this.timer);
    }

    /**
     * 延迟隐藏菜单（提供悬停离开的缓冲时间）
     */
    private delayHideMenu(): void {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            if (this.isMenuOpen) {
                this.menu.style.opacity = '0';
                this.menu.style.visibility = 'hidden';
                this.menu.style.transform = 'translateX(-50%) translateY(20px)'; // 向下隐藏动画
                this.isMenuOpen = false;
            }
        }, 300); // 300ms延迟
    }

    /**
     * 处理菜单项点击事件
     */
    private handleClickMenuItem(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        const menuItemText = target.textContent;
        this.showPopup(menuItemText || "");
    }

    /**
     * 显示内容弹窗
     * @param content 弹窗类型：设置/帮助/关于/分享
     */
    private showPopup(content: string): void {
        // 创建蒙版
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';
        overlay.addEventListener('click', () => {
            popup.remove();
            overlay.remove();
        });

        // 创建弹窗容器
        const popup = document.createElement('div');
        popup.className = 'floating-popup';

        // 根据内容类型生成不同弹窗
        if (content === '设置') {
            new SettingsPopup().show(popup);
        } else if (content === '帮助') {
            new HelpPopup().show(popup);
        } else if (content === '关于') {
            new AboutPopup().show(popup);
        } else if (content === '分享') {
            new SharePopup().show(popup);
        }

        // 添加DOM元素
        document.body.appendChild(overlay);
        document.body.appendChild(popup);

        // 绑定关闭按钮事件
        const closeBtn = popup.querySelector('.popup-close');
        closeBtn?.addEventListener('click', () => {
            popup.remove();
            overlay.remove();
        });

        // 阻止弹窗内容点击事件冒泡
        popup.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
}