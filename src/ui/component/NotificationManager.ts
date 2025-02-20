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

        // 播放提示音
        this.playNotificationSound(settings.soundType);
    }

    // 音效播放器
    soundMap = {
        ding1: 'sounds/ding1.mp3',
        ding2: 'sounds/ding2.mp3',
        beep: 'sounds/beep.mp3'
    };

    playNotificationSound(type: string) {
        if (type === 'none') return;

        const audio = new Audio(this.soundMap[type as keyof typeof this.soundMap]);
        audio.play().catch(() => {
            console.warn('音效播放被浏览器阻止，请与页面交互后重试');
        });
    }

}