import html2canvas from "html2canvas";

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
        // 示例数据（实际应从页面提取）
        return [
            this.createMessageBubble('right', 'user-avatar.jpg', '我', '你好！', '10:20'),
            this.createMessageBubble('left', 'deepseek-avatar.png', 'DeepSeek', '你好！有什么可以帮助你的？', '10:21'),
            this.createMessageBubble('right', 'user-avatar.jpg', '我', '请帮我美化这个聊天记录', '10:22'),
            this.createMessageBubble('left', 'deepseek-avatar.png', 'DeepSeek', '已为您优化样式，现在看起来更专业了！🎉', '10:23')
        ];
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
                        gap: 12px; 
                        margin: 16px 0;
                        align-items: start;">
                
                <!-- 头像 -->
                <img src="${avatar}" 
                     alt="${sender}" 
                     style="width: 40px; 
                            height: 40px; 
                            border-radius: 50%;
                            border: 2px solid ${align === 'right' ? '#007bff' : '#e0e0e0'};
                            object-fit: cover;" />

                <!-- 消息内容 -->
                <div style="max-width: 70%; 
                            position: relative;
                            ${align === 'right' ? 'margin-right: 12px;' : 'margin-left: 12px;'}">
                    <div style="font-size: 12px; 
                                color: #666; 
                                margin-bottom: 4px;
                                text-align: ${align === 'right' ? 'right' : 'left'}">
                        ${sender} · ${time}
                    </div>
                    <div style="background: ${align === 'right' ? '#007bff' : '#f0f0f0'};
                                color: ${align === 'right' ? 'white' : '#333'};
                                padding: 12px;
                                border-radius: ${align === 'right' ? '12px 12px 4px 12px' : '12px 12px 12px 4px'};
                                line-height: 1.5;
                                word-break: break-word;
                                position: relative;">
                        ${message}
                        <div style="position: absolute;
                                    bottom: -6px;
                                    ${align === 'right' ? 'right: 0;' : 'left: 0;'}
                                    width: 12px;
                                    height: 12px;
                                    background: inherit;
                                    clip-path: polygon(0 0, 100% 0, 100% 100%);
                                    transform: rotate(${align === 'right' ? '270deg' : '180deg'});">
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    private async convertToImage(chatRecords: string[]): Promise<string> {
        const container = document.createElement('div');
        Object.assign(container.style, {
            position: 'absolute',
            left: '-9999px',
            width: '500px',
            padding: '24px',
            backgroundColor: '#fff',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
        });

        // Header
        const header = document.createElement('div');
        header.innerHTML = `
            <div style="display: flex; 
                        align-items: center; 
                        margin-bottom: 24px;
                        padding-bottom: 16px;
                        border-bottom: 1px solid #eee;">
                <img src="deepseek-logo.png" 
                     alt="DeepSeek Logo" 
                     style="width: 36px; height: 36px; margin-right: 12px;">
                <div>
                    <div style="font-weight: 600; color: #333;">DeepSeek 助手</div>
                    <div style="font-size: 12px; color: #666;">聊天记录导出 - ${new Date().toLocaleDateString()}</div>
                </div>
            </div>
        `;
        container.appendChild(header);

        // Messages
        chatRecords.forEach(record => {
            const div = document.createElement('div');
            div.innerHTML = record;
            container.appendChild(div);
        });

        document.body.appendChild(container);
        const canvas = await html2canvas(container, {
            backgroundColor: null,
            logging: false,
            scale: 2 // 生成高清图片
        });
        document.body.removeChild(container);

        return canvas.toDataURL('image/png');
    }

    private async copyImageToClipboard(imageUrl: string) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
            new ClipboardItem({'image/png': blob})
        ]);
    }
}