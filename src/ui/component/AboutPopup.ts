export default class AboutPopup {

    private innerHTML: string

    constructor() {
        this.innerHTML = `
            <div class="popup-content">
                <span class="popup-close">&times;</span>
                <h3>关于</h3>
                <div style="margin: 30px 0; line-height: 1.6; color: #666;">
                    <!-- 项目仓库区块 -->
                    <div style="margin-bottom: 25px; padding: 15px; background: #f8f9fa; border-radius: 8px; border: 1px solid #e1e4e8;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; color: #24292f;">
                            <svg style="width:20px;height:20px;flex-shrink:0" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"/>
                            </svg>
                            <span style="font-weight: 600; font-size: 15px;">项目仓库</span>
                        </div>

                        <div style="padding-left: 28px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px;">
                                <a href="https://github.com/llm-sec/deepseek-helper-userscript" 
                                   target="_blank" 
                                   style="display: flex; align-items: center; gap: 8px; color: #0366d6; text-decoration: none; flex-grow: 1;">
                                   <span style="font-family: monospace; background: #f3f4f6; padding: 6px 10px; border-radius: 6px;">
                                       llm-sec/deepseek-helper-userscript
                                   </span>
                                </a>
                                
                                <a href="https://github.com/llm-sec/deepseek-helper-userscript/stargazers" 
                                   target="_blank"
                                   style="display: inline-flex; align-items: center; gap: 4px; color: #57606a; text-decoration: none; padding: 4px 8px;">
                                    <svg style="width:16px;height:16px;margin-top:1px" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"/>
                                    </svg>
                                    <span id="github-stars" style="font-size: 13px; font-weight: 400;">加载中...</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- 作者信息区块 -->
                    <div style="padding: 15px; background: #f8f9fa; border-radius: 8px; border: 1px solid #e1e4e8;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; color: #24292f;">
                            <svg style="width:20px;height:20px" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
                            </svg>
                            <span style="font-weight: 600; font-size: 15px;">作者信息</span>
                        </div>

                        <div style="padding-left: 28px;">
                            <a href="https://github.com/CC11001100" 
                               target="_blank" 
                               style="display: flex; align-items: center; gap: 12px; text-decoration: none; color: inherit;">
                                <img src="https://github.com/CC11001100.png" 
                                     alt="作者头像" 
                                     style="width: 48px; height: 48px; border-radius: 50%; border: 2px solid #e1e4e8; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                                <div>
                                    <div style="font-weight: 600; color: #24292f; margin-bottom: 4px;">CC11001100</div>
                                    <div style="display: flex; align-items: center; gap: 6px; font-size: 13px; color: #57606a;">
                                        <svg style="width:14px;height:14px" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M12,15A7,7 0 0,1 5,8C5,4.14 8.14,1 12,1C15.86,1 19,4.14 19,8A7,7 0 0,1 12,15M12,3.5A4.5,4.5 0 0,0 7.5,8A4.5,4.5 0 0,0 12,12.5A4.5,4.5 0 0,0 16.5,8A4.5,4.5 0 0,0 12,3.5M20,19.5C20,21.43 16.42,23 12,23C7.58,23 4,21.43 4,19.5C4,17.57 7.58,16 12,16C16.42,16 20,17.57 20,19.5Z"/>
                                        </svg>
                                        <span>GitHub 主页</span>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    show(popup: HTMLElement) {
        popup.innerHTML = this.innerHTML;

        // 使用油猴脚本的GM_xmlhttpRequest绕过跨域限制
        const starsElement = popup.querySelector('#github-stars');
        if (!starsElement) return;

        // @ts-ignore 调用油猴API
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://api.github.com/repos/llm-sec/deepseek-helper-userscript",
            timeout: 5000,
            onload: (response) => {
                try {
                    const data = JSON.parse(response.responseText);
                    const stars = data.stargazers_count?.toLocaleString() || '未知';
                    starsElement.textContent = stars;
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