import {SettingsManager} from "./SettingsManager";

export default class NotificationManager {

    // 在触发通知的位置新增以下逻辑
    triggerCompletionNotify(isDeepThinking: boolean) {
        const settings = SettingsManager.getSettings();

        // 校验通知条件
        if (settings.deepThinkingOnly && !isDeepThinking) return;

        // 触发系统通知
        if (Notification.permission === 'granted') {
            new Notification('回答已完成', {
                body: '当前问题已处理完毕',
                icon: 'icon.png'
            });
        }

    }

}