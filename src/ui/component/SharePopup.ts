import html2canvas from "html2canvas";
import SessionElement from "../../selector/SessionElement";
import AnswertElement from "../../selector/AnswertElement";
import QueryElement from "../../selector/QueryElement";

// 新增动画样式常量
const BUTTON_STYLES = `
<style>
@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.copy-button {
  --primary-color: #6366f1;
  --hover-color: #4f46e5;
  --accent-color: #a855f7;
  position: relative;
  padding: 12px 32px;
  border: none;
  border-radius: 50px;
  background: linear-gradient(
    135deg,
    var(--primary-color) 0%,
    var(--accent-color) 100%
  );
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  box-shadow: 0 4px 24px -6px rgba(99, 102, 241, 0.4);
}

.copy-button::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    45deg,
    var(--primary-color) 20%,
    var(--accent-color) 100%
  );
  opacity: 0;
  transition: opacity 0.4s;
}

.copy-button:hover {
  box-shadow: 0 8px 32px -8px rgba(99, 102, 241, 0.6);
  transform: translateY(-2px);
}

.copy-button:hover::before {
  opacity: 1;
}

.copy-button:active {
  transform: scale(0.98);
}

.copy-button .ripple {
  position: absolute;
  background: rgba(255, 255, 255, 0.4);
  transform: scale(0);
  animation: ripple 600ms ease-out;
  border-radius: 50%;
}

.copy-button svg {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  transition: transform 0.3s ease;
}

.copy-button:hover svg {
  transform: rotate(-10deg) scale(1.1);
}

.copy-button.loading svg {
  animation: spin 1s linear infinite;
}

.copy-button.success {
  --primary-color: #10b981;
  --accent-color: #059669;
}

.copy-button.error {
  --primary-color: #ef4444;
  --accent-color: #dc2626;
}

@media (max-width: 768px) {
  .copy-button {
    padding: 10px 24px;
    font-size: 14px;
  }
}
</style>
`;

export default class SharePopup {

    private innerHTML: string;

    constructor() {
        this.innerHTML = `
            <div class="popup-content">
                <span class="popup-close">&times;</span>
                <h3 style="margin-bottom: 24px; font-size: 18px; color: #333;">分享聊天记录</h3>
                <div id="share-preview" style="text-align: center; margin: 20px 0; min-height: 200px; display: flex; align-items: center; justify-content: center;">
                    <div class="loading-spinner"></div>
                    <p style="color: #999;">正在生成预览...</p>
                </div>
                <div style="text-align: center; margin-top: 24px;">
                    <button id="copy-image-btn" class="copy-button">
                        <svg viewBox="0 0 24 24" width="18" height="18" style="margin-right: 8px;">
                            <path fill="currentColor" d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"/>
                        </svg>
                        复制图片
                    </button>
                </div>
            </div>
        `;
    }

    show(popup: HTMLElement) {
        popup.innerHTML = BUTTON_STYLES + this.innerHTML;

        // 获取聊天记录
        const chatRecords = this.getChatRecords();
        if (chatRecords.length === 0) {
            this.showErrorMessage(popup, '未找到聊天记录');
            return;
        }

        // 动态加载 html2canvas
        // this.loadHtml2Canvas().then(() => {
        //     this.convertToImage(chatRecords).then((imageUrl) => {
        //         this.updatePreview(popup, imageUrl);
        //         this.setupCopyButton(popup, imageUrl);
        //     }).catch(() => {
        //         this.showErrorMessage(popup, '生成预览失败');
        //     });
        // }).catch((error) => {
        //     console.error('Failed to load html2canvas:', error);
        //     this.showErrorMessage(popup, '依赖加载失败，请刷新重试');
        // });
        this.convertToImage(chatRecords).then((imageUrl) => {
            this.updatePreview(popup, imageUrl);
            this.setupCopyButton(popup, imageUrl);
        }).catch(() => {
            this.showErrorMessage(popup, '生成预览失败');
        });
    }

    private showErrorMessage(popup: HTMLElement, message: string) {
        const preview = popup.querySelector('#share-preview');
        if (preview) {
            preview.innerHTML = `
                <div style="color: #ff4444; padding: 20px;">
                    <svg viewBox="0 0 24 24" width="24" height="24" style="margin-bottom: 8px;">
                        <path fill="currentColor" d="M11 15h2v2h-2zm0-8h2v6h-2zm1-5C6.47 2 2 6.5 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 18a8 8 0 0 1-8-8a8 8 0 0 1 8-8a8 8 0 0 1 8 8a8 8 0 0 1-8 8"/>
                    </svg>
                    <p>${message}</p>
                </div>
            `;
        }
    }

    private updatePreview(popup: HTMLElement, imageUrl: string) {
        const preview = popup.querySelector('#share-preview');
        if (preview) {
            preview.innerHTML = `
                <div style="position: relative;">
                    <img src="${imageUrl}" alt="聊天记录预览" 
                         style="max-width: 100%; border-radius: 12px; border: 1px solid rgba(0,0,0,0.1);">
                    <div class="watermark" style="position: absolute; bottom: 10px; right: 10px; color: rgba(0,0,0,0.2); font-size: 12px;">
                        Generated by DeepSeek Helper
                    </div>
                </div>
            `;
        }
    }

    private setupCopyButton(popup: HTMLElement, imageUrl: string) {
        const copyBtn = popup.querySelector<HTMLButtonElement>('#copy-image-btn');
        if (copyBtn) {
            let isProcessing = false;

            // 动态波纹效果
            const createRipple = (e: MouseEvent) => {
                if (isProcessing) return;

                const rect = copyBtn.getBoundingClientRect();
                const ripple = document.createElement('div');
                ripple.className = 'ripple';
                ripple.style.width = ripple.style.height = `${Math.min(rect.width, rect.height)}px`;
                ripple.style.left = `${e.clientX - rect.left - rect.width / 2}px`;
                ripple.style.top = `${e.clientY - rect.top - rect.height / 2}px`;
                copyBtn.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            };

            copyBtn.addEventListener('click', async (e) => {
                if (isProcessing) return;
                isProcessing = true;

                copyBtn.classList.add('loading');
                await new Promise(resolve => setTimeout(resolve, 200)); // 延迟提升体验

                try {
                    await this.copyImageToClipboard(imageUrl);
                    copyBtn.classList.remove('loading');
                    copyBtn.classList.add('success');
                    this.showToast('🎉 图片已复制到剪贴板！');

                    // 成功状态保持
                    setTimeout(() => {
                        copyBtn.classList.remove('success');
                    }, 2000);
                } catch (error) {
                    copyBtn.classList.remove('loading');
                    copyBtn.classList.add('error');
                    this.showToast('❌ 复制失败，请手动保存');

                    setTimeout(() => {
                        copyBtn.classList.remove('error');
                    }, 2000);
                } finally {
                    setTimeout(() => {
                        isProcessing = false;
                    }, 300);
                }
            });

            // 鼠标交互效果
            copyBtn.addEventListener('mousedown', createRipple);
            copyBtn.addEventListener('touchstart', (e) => {
                const touch = e.touches[0];
                createRipple(new MouseEvent('mousedown', {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                }));
            });
        }
    }

    private showToast(message: string) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 14px;
            backdrop-filter: blur(4px);
            animation: fadeInUp 0.3s ease;
            z-index: 2000;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }

    // private loadHtml2Canvas(): Promise<void> {
    //     return new Promise((resolve, reject) => {
    //         const script = document.createElement('script');
    //         script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
    //         script.onload = () => resolve();
    //         script.onerror = () => reject(new Error('Failed to load html2canvas'));
    //         document.head.appendChild(script);
    //     });
    // }

    private getChatRecords(): string[] {

        // TODO 2025-02-14 00:03:18 从页面中获取对话内容
        const talkList = new SessionElement().selectAllTalkElement();

        const talkForRender = [];
        for (const talk of talkList) {
            // 修改getChatRecords方法中的innerText为innerHTML
            if (talk instanceof AnswertElement) {
                const r = this.createMessageBubble('right', 'user-avatar.jpg', 'DeepSeek', talk.answerElement.innerHTML, '00:00');
                talkForRender.push(r);
            } else if (talk instanceof QueryElement) {
                const r = this.createMessageBubble('left', 'user-avatar.jpg', '我', talk.queryElement.innerHTML, '00:00');
                talkForRender.push(r);
            }
        }
        return talkForRender;
    }

    private createMessageBubble(
        align: 'left' | 'right',
        avatar: string,
        sender: string,
        message: string,
        time: string
    ): string {
        return `
    <div class="message-container ${align}" 
         style="display: flex;
                flex-direction: ${align === 'right' ? 'row-reverse' : 'row'};
                gap: 20px;
                margin: 24px 0;
                align-items: flex-start;
                width: 100%;
                min-width: 0;
                max-width: 100%;">
        
        <!-- 头像优化 -->
        <img src="${avatar}" 
             style="width: 56px;
                    height: 56px;
                    flex-shrink: 0;
                    border: 2px solid ${align === 'right' ? '#6366f1' : '#e0e0e0'};
                    border-radius: 50%;
                    object-fit: cover;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
        
        <!-- 消息内容容器 -->
        <div style="max-width: calc(100% - 96px);
                    min-width: 240px;
                    flex-shrink: 0;
                    position: relative;
                    font-family: 'Segoe UI', system-ui, sans-serif;">
            
            <!-- 头部信息 -->
            <div style="font-size: 14px;
                        margin-bottom: 12px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        color: ${align === 'right' ? 'rgba(255,255,255,0.9)' : '#666'};">
                <span style="font-weight: 600;">${sender}</span>
                <span style="opacity:0.7; font-size: 0.9em">${time}</span>
            </div>
            
            <!-- 消息主体 -->
            <div style="background: ${align === 'right' ? '#6366f1' : '#f8f9fa'};
                        color: ${align === 'right' ? 'white' : '#333'};
                        padding: 18px;
                        border-radius: ${align === 'right' ? '20px 20px 4px 20px' : '20px 20px 20px 4px'};
                        line-height: 1.7;
                        word-break: break-word;
                        overflow-wrap: anywhere;
                        box-shadow: 0 4px 16px rgba(0,0,0,0.08);
                        position: relative;">
                ${message}
                
                <!-- 小箭头装饰 -->
                <div style="position: absolute;
                            bottom: -8px;
                            ${align === 'right' ? 'right: 12px;' : 'left: 12px;'}
                            width: 16px;
                            height: 16px;
                            background: inherit;
                            clip-path: polygon(0 0, 100% 0, 100% 100%);
                            transform: rotate(${align === 'right' ? '270deg' : '180deg'});">
                </div>
            </div>
        </div>
    </div>`;
    }

    private async convertToImage(chatRecords: string[]): Promise<string> {
        const container = document.createElement('div');
        Object.assign(container.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-0%, -0%)',
            width: '680px',
            maxWidth: '90vw',
            padding: '40px 32px',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
            fontFamily: "'Inter', -apple-system, system-ui",
            zIndex: '99999',
            overflow: 'hidden',  // 外层容器保持hidden
            height: 'auto',      // 关键修改点1：改为自动高度
            maxHeight: 'none'    // 关键修改点2：取消最大高度限制
        });


        // Header
        const header = document.createElement('div');
        header.innerHTML = `
    <div style="display: flex;
                align-items: center;
                margin-bottom: 32px;
                padding-bottom: 24px;
                border-bottom: 1px solid rgba(0,0,0,0.08);">
        <img src="deepseek-logo.png" 
             crossorigin="anonymous"
             style="width: 48px;
                    height: 48px;
                    margin-right: 20px;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div>
            <div style="font-weight: 700;
                        color: #2d3748;
                        font-size: 22px;
                        letter-spacing: -0.5px;">
                DeepSeek 助手
            </div>
            <div style="font-size: 14px;
                        color: #718096;
                        margin-top: 6px;">
                ${new Date().toLocaleDateString()} 聊天记录
            </div>
        </div>
    </div>`;
        container.appendChild(header);

        // 消息内容容器
        const contentWrapper = document.createElement('div');
        Object.assign(contentWrapper.style, {
            maxHeight: '70vh',
            overflowY: 'auto',
            paddingRight: '16px',
            scrollbarWidth: 'thin'  // Firefox兼容
        });

        // 添加CSS滚动条样式
        const scrollStyle = document.createElement('style');
        scrollStyle.textContent = `
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-thumb {
            background: rgba(0,0,0,0.12);
            border-radius: 4px;
        }
    `;
        contentWrapper.appendChild(scrollStyle);

        // 添加消息记录
        chatRecords.forEach(record => {
            const div = document.createElement('div');
            div.style.cssText = `
            width: 100%;
            min-width: 0;
            flex-shrink: 0;
            contain: content;  // 提升渲染性能
        `;
            div.innerHTML = record;
            contentWrapper.appendChild(div);
        });
        container.appendChild(contentWrapper);

        document.body.appendChild(container);

        // 强制布局计算
        await new Promise(resolve => {
            container.offsetHeight; // 触发回流
            requestAnimationFrame(resolve);
        });

        try {
            const canvas = await html2canvas(container, {
                backgroundColor: '#ffffff',
                logging: true,
                scale: 2,
                useCORS: true,
                windowWidth: container.offsetWidth,
                windowHeight: container.scrollHeight,
                scrollY: 0,
                onclone: (clonedDoc, element) => {
                    // 隐藏滚动条
                    element.style.paddingRight = '8px';
                    element.querySelectorAll('*').forEach(el => {
                        if (el instanceof HTMLElement) {
                            el.style.scrollbarWidth = 'none';
                        }
                    });
                }
            });
            return canvas.toDataURL('image/png');
        } finally {
            document.body.removeChild(container);
        }
    }

    private async copyImageToClipboard(imageUrl: string) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
            new ClipboardItem({'image/png': blob})
        ]);
    }
}