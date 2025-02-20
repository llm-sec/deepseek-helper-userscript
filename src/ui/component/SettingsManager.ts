// 新增类型定义
interface NotificationSettings {
    deepThinkingOnly: boolean;
    soundType: 'none' | 'ding1' | 'ding2' | 'beep';
}

// 配置存储逻辑
class SettingsManager {
    private static STORAGE_KEY = 'notification_settings';

    static getSettings(): NotificationSettings {
        const defaultSettings: NotificationSettings = {
            deepThinkingOnly: true,
            soundType: 'ding1'
        };
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEY)!) || defaultSettings;
        } catch {
            return defaultSettings;
        }
    }

    static saveSettings(settings: NotificationSettings) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
    }
}