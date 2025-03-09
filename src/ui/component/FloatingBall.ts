// FloatingBall.ts
import FloatingBallStyles from "./FloatingBallStyles";

interface MenuItemConfig {
    icon: string;
    color: string;
    action: () => void;
    label?: string;
}

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
    private isMenuOpen: boolean = false;
    private enterTimer: number = 0;
    private leaveTimer: number = 0;

    constructor(private menuConfig: MenuItemConfig[]) {
        this.container = document.createElement('div');
        this.container.className = 'floating-container';

        this.ball = this.createBall();
        this.menu = this.createMenu();

        this.container.appendChild(this.ball);
        this.container.appendChild(this.menu);
        document.body.appendChild(this.container);

        this.bindEvents();
        new FloatingBallStyles();
    }

    private createBall(): HTMLElement {
        const ball = document.createElement('div');
        ball.className = 'floating-ball';
        return ball;
    }

    private createMenu(): HTMLElement {
        const menu = document.createElement('div');
        menu.className = 'floating-menu';

        this.items = this.menuConfig.map((config, index) => {
            const menuItem = document.createElement('div');
            menuItem.className = 'floating-menu-item';
            menuItem.style.color = config.color;

            const icon = document.createElement('i');
            icon.className = `fas ${config.icon}`;
            menuItem.appendChild(icon);

            if (config.label) {
                const label = document.createElement('span');
                label.className = 'menu-item-label';
                label.textContent = config.label;
                menuItem.appendChild(label);
            }

            const angle = this.calculateAngle(index);
            const radius = 120;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);

            menuItem.style.transform = `translate(${x}px, ${y}px)`;
            menuItem.style.transitionDelay = `${index * 40}ms`;

            menuItem.addEventListener('click', (e) => {
                e.stopPropagation();
                config.action();
                this.hideMenu();
            });

            return menuItem;
        });

        this.items.forEach(item => menu.appendChild(item));
        return menu;
    }

    private calculateAngle(index: number): number {
        const total = this.menuConfig.length;
        const startAngle = -Math.PI/2 - (135 * Math.PI/180)/2;
        const angleStep = total > 1 ? (135 * Math.PI/180)/(total - 1) : 0;
        return startAngle + angleStep * index;
    }

    private bindEvents(): void {
        this.ball.addEventListener('mouseenter', () => this.handleMouseEnter());
        this.ball.addEventListener('mouseleave', () => this.handleMouseLeave());
        this.ball.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.toggleMenu();
        });

        this.menu.addEventListener('mouseenter', () => clearTimeout(this.leaveTimer));
        this.menu.addEventListener('mouseleave', () => this.handleMouseLeave());

        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target as Node)) {
                this.hideMenu();
            }
        });
    }

    private handleMouseEnter(): void {
        clearTimeout(this.enterTimer);
        this.enterTimer = window.setTimeout(() => this.showMenu(), 200);
    }

    private handleMouseLeave(): void {
        clearTimeout(this.enterTimer);
        this.leaveTimer = window.setTimeout(() => this.hideMenu(), 300);
    }

    private toggleMenu(): void {
        this.isMenuOpen ? this.hideMenu() : this.showMenu();
    }

    private showMenu(): void {
        if (this.isMenuOpen) return;
        this.isMenuOpen = true;
        this.menu.classList.add('active');
        this.ball.classList.add('active');
    }

    private hideMenu(): void {
        if (!this.isMenuOpen) return;
        this.isMenuOpen = false;
        this.menu.classList.remove('active');
        this.ball.classList.remove('active');
    }
}