import HelpPopupStyles from "./HelpPopupStyles";

export default class HelpPopup {
    private innerHTML: string
    private styles: HelpPopupStyles;

    constructor() {
        this.styles = new HelpPopupStyles();
        this.innerHTML = `
            <div class="popup-content">
                <span class="popup-close">&times;</span>
                <div class="help-container">
                    <h3>帮助与信息</h3>
                    
                    <!-- 选项卡导航 -->
                    <nav class="tab-nav">
                        <button class="tab-btn active" data-tab="guide">使用指南</button>
                        <button class="tab-btn" data-tab="about">关于项目</button>
                    </nav>

                    <!-- 内容区域 -->
                    <div class="tab-content">
                        <!-- 使用指南 -->
                        <div class="tab-pane active" data-tab="guide">
                            ${this.createGuideSection()}
                            ${this.createFAQSection()}
                        </div>

                        <!-- 关于项目 -->
                        <div class="tab-pane" data-tab="about">
                            ${this.createProjectSection()}
                            ${this.createAuthorSection()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    private createGuideSection(): string {
        return `
            <div class="info-card">
                <div class="card-header">
                    <svg class="icon" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M13.5 4A1.5 1.5 0 0 0 12 5.5 1.5 1.5 0 0 0 13.5 7 1.5 1.5 0 0 0 15 5.5 1.5 1.5 0 0 0 13.5 4M13 14H11V8H13M13 18H11V16H13M12 2C6.47 2 2 6.5 2 12A10 10 0 0 0 12 22 10 10 0 0 0 22 12 10 10 0 0 0 12 2"/>
                    </svg>
                    <h4>使用指南</h4>
                </div>
                <div class="card-body">
                    <div class="section">
                        <h5>基本操作</h5>
                        <ul>
                            <li>点击悬浮球展开功能菜单</li>
                            <li>鼠标悬停可保持菜单展开状态</li>
                            <li>点击蒙版或关闭按钮可退出弹窗</li>
                        </ul>
                    </div>
                    <div class="section">
                        <h5>功能说明</h5>
                        <ul>
                            <li><strong>设置</strong> - 调整个性化参数</li>
                            <li><strong>分享</strong> - 快速分享当前页面</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    private createFAQSection(): string {
        return `
            <div class="info-card">
                <div class="card-header">
                    <svg class="icon" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M11 18H13V16H11V18M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M12 6C9.79 6 8 7.79 8 10H10C10 8.9 10.9 8 12 8S14 8.9 14 10C14 12 11 11.75 11 15H13C13 12.75 16 12.5 16 10C16 7.79 14.21 6 12 6"/>
                    </svg>
                    <h4>常见问题</h4>
                </div>
                <div class="card-body">
                    <div class="qa-item">
                        <h5>Q：菜单无法正常展开？</h5>
                        <p>请尝试刷新页面或检查浏览器插件冲突，建议使用Chrome最新版本</p>
                    </div>
                    <div class="qa-item">
                        <h5>Q：如何反馈问题？</h5>
                        <p>可通过Git仓库提交issue：
                            <a href="https://github.com/llm-sec/deepseek-helper-userscript/issues" 
                               target="_blank"
                               class="link">
                                github.com/llm-sec/deepseek-helper-userscript/issues
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    private createProjectSection(): string {
        return `
            <div class="info-card">
                <div class="card-header">
                    <svg class="icon" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"/>
                    </svg>
                    <h4>项目信息</h4>
                </div>
                <div class="card-body">
                    <div class="repo-info">
                        <a href="https://github.com/llm-sec/deepseek-helper-userscript" 
                           target="_blank" 
                           class="repo-link">
                           <code>llm-sec/deepseek-helper-userscript</code>
                           <span class="stars" id="github-stars">加载中...</span>
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    private createAuthorSection(): string {
        return `
            <div class="info-card">
                <div class="card-header">
                    <svg class="icon" viewBox="0 0 24 24">  <!-- 添加icon类 -->
                        <path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
                    </svg>
                    <h4>作者信息</h4>
                </div>
                <!-- 其余保持不变 -->
            </div>
        `;
    }

    show(popup: HTMLElement) {
        popup.innerHTML = this.innerHTML;

        // 初始化选项卡
        this.initTabs(popup);

        // 初始化关闭按钮
        const closeBtn = popup.querySelector('.popup-close');
        closeBtn?.addEventListener('click', () => {
            popup.remove();
            document.querySelector('.popup-overlay')?.remove();
        });

        // 加载GitHub星标数
        this.loadGitHubStars(popup);
    }

    private initTabs(popup: HTMLElement) {
        const tabs = Array.from(popup.querySelectorAll('.tab-btn')) as HTMLElement[];
        const panes = Array.from(popup.querySelectorAll('.tab-pane')) as HTMLElement[];

        const activateTab = (targetTab: string) => {
            // 激活对应选项卡
            tabs.forEach(tab => {
                const isActive = tab.dataset.tab === targetTab;
                tab.classList.toggle('active', isActive);
                tab.style.pointerEvents = isActive ? 'none' : 'auto';
            });

            // 显示对应内容
            panes.forEach(pane => {
                pane.classList.toggle('active', pane.dataset.tab === targetTab);
            });

            // 自动滚动到顶部
            const content = popup.querySelector('.tab-content') as HTMLElement;
            if (content) content.scrollTop = 0;
        };

        // 初始化点击事件
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTab = tab.dataset.tab;
                if (targetTab) activateTab(targetTab);
            });

            // 添加键盘支持
            tab.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const targetTab = tab.dataset.tab;
                    if (targetTab) activateTab(targetTab);
                }
            });
        });

        // 强制触发一次滚动布局
        setTimeout(() => {
            const content = popup.querySelector('.tab-content');
            content?.dispatchEvent(new CustomEvent('scroll'));
        }, 50);
    }

    private loadGitHubStars(popup: HTMLElement) {
        const starsElement = popup.querySelector('#github-stars');
        if (!starsElement) return;

        // @ts-ignore
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://api.github.com/repos/llm-sec/deepseek-helper-userscript",
            timeout: 5000,
            onload: (response) => {
                try {
                    const data = JSON.parse(response.responseText);
                    starsElement.textContent = data.stargazers_count?.toLocaleString() || '未知';
                } catch (e) {
                    starsElement.textContent = '数据异常';
                }
            },
            onerror: () => {
                starsElement.textContent = '获取失败';
            },
            ontimeout: () => {
                starsElement.textContent = '请求超时';
            }
        });
    }
}