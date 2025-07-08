import React from 'react';
import ReactDOM from 'react-dom/client';
import FloatingBall from '../ui/component/FloatingBall';
import logger from '../logger/Logger';

export function renderFloatingBall() {
    try {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initFloatingBall);
        } else {
            initFloatingBall();
        }
    } catch (error) {
        logger.error('渲染悬浮球时发生错误', error);
    }
}

function initFloatingBall() {
    try {
        console.log('初始化网页编辑器...');
        
        // 加载Font Awesome
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
            document.head.appendChild(link);
        }

        const appContainer = document.createElement('div');
        appContainer.id = "deepseek-helper-root";
        document.body.appendChild(appContainer);

        const root = ReactDOM.createRoot(appContainer);
        
        // 示例菜单配置
        const menuConfig = [
            { icon: 'fa-home', color: '#1E88E5', action: () => console.log('Home clicked'), label: '主页' },
            { icon: 'fa-cog', color: '#43A047', action: () => console.log('Settings clicked'), label: '设置' },
            { icon: 'fa-question', color: '#F4511E', action: () => console.log('Help clicked'), label: '帮助' },
        ];

        root.render(
            <React.StrictMode>
                <FloatingBall menuConfig={menuConfig} />
            </React.StrictMode>
        );
        
        logger.debug('悬浮球初始化完成');
    } catch (error) {
        logger.error('初始化悬浮球时发生错误', error);
    }
} 