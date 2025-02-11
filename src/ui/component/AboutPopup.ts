export default class AboutPopup {

    private innerHTML: string

    constructor() {
        this.innerHTML = `
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
    }

    show(popup: HTMLElement) {
        popup.innerHTML = this.innerHTML;

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