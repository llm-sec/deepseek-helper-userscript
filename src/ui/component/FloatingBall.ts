// FloatingBall.ts
import FloatingBallStyles from "./FloatingBallStyles";

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
        const menuItems = ['设置', '帮助', '关于'];
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
     * @param content 弹窗类型：设置/帮助/关于
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
            this.createSettingsPopup(popup);
        } else if (content === '帮助') {
            this.createHelpPopup(popup);
        } else if (content === '关于') {
            this.createAboutPopup(popup);
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

    /**
     * 创建设置弹窗内容
     */
    private createSettingsPopup(popup: HTMLElement): void {
        popup.innerHTML = `
            <div class="popup-content">
                <span class="popup-close">&times;</span>
                <h3>重试算法设置</h3>
                <div class="setting-section">
                    <label>重试算法：</label>
                    <div class="custom-select">
                        <select id="retryAlgorithmSelect">
                            <option value="exponential" selected>指数退避</option>
                            <option value="fixed">固定时间</option>
                        </select>
                    </div>
                </div>
                <div id="exponentialExplanation" class="explanation">
                    指数退避算法会在每次失败后等待时间呈指数增长（例如1秒、2秒、4秒、8秒），有效缓解服务压力并提高重试成功率。
                </div>
                <div id="fixedTimeConfig" class="config-section" style="display: none;">
                    <div class="time-config">
                        <label>时间间隔：</label>
                        <div style="display: flex; gap: 12px;">
                            <input type="number" id="fixedTimeValue" class="time-input" value="1" min="1" />
                            <div class="custom-select" style="flex:1">
                                <select id="timeUnitSelect">
                                    <option value="hours">小时</option>
                                    <option value="minutes" selected>分钟</option>
                                    <option value="seconds">秒</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 绑定算法选择切换事件
        const algorithmSelect = popup.querySelector('#retryAlgorithmSelect');
        algorithmSelect?.addEventListener('change', (e) => {
            const value = (e.target as HTMLSelectElement).value;
            const exponentialExplanation = popup.querySelector('#exponentialExplanation') as HTMLElement;
            const fixedTimeConfig = popup.querySelector('#fixedTimeConfig') as HTMLElement;
            exponentialExplanation.style.display = value === 'fixed' ? 'none' : 'block';
            fixedTimeConfig.style.display = value === 'fixed' ? 'block' : 'none';
        });
    }

    /**
     * 创建帮助弹窗内容
     */
    private createHelpPopup(popup: HTMLElement): void {
        popup.innerHTML = `
            <div class="popup-content">
                <span class="popup-close">&times;</span>
                <h3>帮助</h3>
                <div style="text-align: center; margin-top: 30px;">
                    <img src="https://cc11001100.github.io/images/wechat-qrcode.png" 
                         alt="微信二维码" 
                         style="width: 200px; height: 200px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <p style="margin-top: 20px; color: #666;">有问题请加作者微信反馈</p>
                </div>
            </div>
        `;
    }

    /**
     * 创建关于弹窗内容
     */
    private createAboutPopup(popup: HTMLElement): void {
        popup.innerHTML = `
            <div class="popup-content">
                <span class="popup-close">&times;</span>
                <h3>关于</h3>
                <div style="margin: 30px 0; line-height: 1.6; color: #666;">
                    <p>🗃️ GitHub仓库：<br>
                        <a href="https://github.com/llm-sec/deepseek-helper-userscript" 
                           target="_blank" 
                           style="color: #007bff; text-decoration: none;">
                           https://github.com/llm-sec/deepseek-helper-userscript
                        </a>
                    </p>
                    <p>⭐️ Stars：<span id="github-stars">加载中...</span></p>
                    <p>👨💻 作者：CC11001100</p>
                </div>
            </div>
        `;

        // 获取GitHub仓库星标数
        fetch('https://api.github.com/repos/llm-sec/deepseek-helper-userscript')
            .then(response => response.json())
            .then(data => {
                const stars = data.stargazers_count || '未知';
                const starsElement = popup.querySelector('#github-stars');
                if (starsElement) starsElement.textContent = stars.toString();
            })
            .catch(() => {
                const starsElement = popup.querySelector('#github-stars');
                if (starsElement) starsElement.textContent = '获取失败';
            });
    }
}