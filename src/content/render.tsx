import React from 'react';
import ReactDOM from 'react-dom/client';
import FloatingBall from '../ui/component/FloatingBall';
import logger from '../logger/Logger';

/**
 * 渲染悬浮球组件
 * 包含完整的错误处理和日志记录
 */
export function renderFloatingBall() {
    try {
        logger.debug('准备渲染悬浮球组件...');
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initFloatingBall);
            logger.debug('DOM尚未加载完成，已注册DOMContentLoaded事件');
        } else {
            initFloatingBall();
        }
    } catch (error) {
        logger.error('渲染悬浮球时发生错误', error);
        console.error('渲染悬浮球时发生错误:', error);
    }
}

/**
 * 初始化悬浮球组件
 * 负责创建DOM容器、加载依赖资源和渲染React组件
 */
function initFloatingBall() {
    try {
        console.log('初始化网页编辑器...');
        
        // 加载Font Awesome
        try {
            if (!document.querySelector('link[href*="font-awesome"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
                document.head.appendChild(link);
                logger.debug('Font Awesome样式表已加载');
            }
        } catch (fontError) {
            logger.warn('加载Font Awesome时出错，但将继续执行', fontError);
        }

        // 创建容器元素
        try {
            // 检查是否已存在容器
            let appContainer = document.getElementById("deepseek-helper-root");
            
            if (!appContainer) {
                appContainer = document.createElement('div');
                appContainer.id = "deepseek-helper-root";
                document.body.appendChild(appContainer);
                logger.debug('创建应用容器元素');
            } else {
                logger.debug('应用容器元素已存在，将重用');
                // 清空现有容器
                appContainer.innerHTML = '';
            }
            
            // 渲染React组件
            try {
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
            } catch (renderError) {
                logger.error('渲染React组件时出错', renderError);
                console.error('渲染React组件时出错:', renderError);
            }
        } catch (containerError) {
            logger.error('创建容器元素时出错', containerError);
            console.error('创建容器元素时出错:', containerError);
        }
    } catch (error) {
        logger.error('初始化悬浮球时发生错误', error);
        console.error('初始化悬浮球时发生错误:', error);
    }
} 