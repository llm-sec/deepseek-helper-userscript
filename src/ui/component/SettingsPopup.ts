import {SettingsManager} from "./SettingsManager";

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
                <h3>回答完毕通知方式</h3>
                <!-- 新增在设置弹窗容器内 -->
                <div class="setting-item">
                    <label class="setting-label">
                        <input type="checkbox" id="deepThinkingNotify" checked> 
                        <span>仅当深度思考通知</span>
                    </label>
                    <div class="setting-tip">仅在深度思考模式完成时弹出系统通知</div>
                </div>
                
                <div class="setting-item">
                    <label class="setting-label">提示音：</label>
                    <select id="notificationSound" class="setting-select">
                        <option value="none">无声音</option>
                        <option value="ding1" selected>叮~</option>
                        <option value="ding2">叮咚</option>
                        <option value="beep">哔哔声</option>
                    </select>
                </div>
            </div>
        `;
    }

    show(popup: HTMLElement) {
        popup.innerHTML = this.innerHTML;

        // this.initNotificationSettings();

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

    private initNotificationSettings() {
        const { deepThinkingOnly, soundType } = SettingsManager.getSettings();

        // 绑定复选框
        const checkbox = document.getElementById('deepThinkingNotify') as HTMLInputElement;
        checkbox.checked = deepThinkingOnly;
        checkbox.addEventListener('change', () => {
            const settings = SettingsManager.getSettings();
            settings.deepThinkingOnly = checkbox.checked;
            SettingsManager.saveSettings(settings);
        });

        // 绑定下拉框
        const select = document.getElementById('notificationSound') as HTMLSelectElement;
        select.value = soundType;
        select.addEventListener('change', () => {
            const settings = SettingsManager.getSettings();
            settings.soundType = select.value as any;
            SettingsManager.saveSettings(settings);
        });
    }

}