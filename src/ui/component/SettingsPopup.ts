/**
 * 设置弹窗
 */
export class SettingsPopup {

    private innerHTML: string

    constructor() {
        this.innerHTML = `
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
    }

    show(popup: HTMLElement) {
        popup.innerHTML = this.innerHTML;

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

}