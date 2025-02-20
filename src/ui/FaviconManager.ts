export default class FaviconManager {
    private originalHref: string;
    private linkElement: HTMLLinkElement;
    private isLoading: boolean = false;
    private canvasCache: HTMLCanvasElement | null = null;

    constructor() {
        this.linkElement = this.getFaviconLink();
        this.originalHref = this.linkElement.href;
        this.initVisibilityHandler();
        if (!this.originalHref) {
            console.warn('Initial favicon href is empty, animated effects may not work properly');
        }
    }

    private initVisibilityHandler() {
        const handler = () => {
            if (document.visibilityState === 'visible' && this.isLoading) {
                this.restoreLoadingState();
            }
        };
        document.addEventListener('visibilitychange', handler);
        window.addEventListener('focus', handler);
    }

    private restoreLoadingState() {
        if (this.isLoading && this.canvasCache) {
            this.updateFavicon(this.canvasCache);
        }
    }

    private getFaviconLink(): HTMLLinkElement {
        let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        return link;
    }

    public async setLoading(): Promise<void> {
        this.isLoading = true;

        try {
            const img = await this.loadImage(this.originalHref);
            const canvas = document.createElement('canvas');
            this.canvasCache = canvas;
            const width = img.width;
            const height = img.height;
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d')!;

            ctx.drawImage(img, 0, 0, width, height);
            this.drawStaticLoadingEffect(ctx, width, height);
            this.updateFavicon(canvas);
        } catch (error) {
            console.error('Failed to set loading state:', error);
        }
    }

    public async setCompleted(): Promise<void> {
        this.isLoading = false;

        try {
            const img = await this.loadImage(this.originalHref);
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            this.drawCheckmarkEffect(ctx, img.width, img.height);
            this.updateFavicon(canvas);
        } catch (error) {
            console.error('Failed to set completed state:', error);
        }
    }

    private drawStaticLoadingEffect(
        ctx: CanvasRenderingContext2D,
        width: number,
        height: number
    ) {
        // 精确贴边计算
        const indicatorDiameter = Math.min(width, height) * 0.5;
        const radius = indicatorDiameter / 2;
        // 直接使用画布边界计算坐标
        const centerX = width - radius;
        const centerY = height - radius;

        // 绘制贴边圆形（右/下边缘0px间距）
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 70, 70, 0.9)'; // 增强红色饱和度
        ctx.fill();

        // 绘制超明显感叹号（占圆形区域75%）
        const symbolHeight = radius * 0.75;
        const lineWidth = radius * 0.22;

        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';

        // 垂直线段（贴圆形顶部）
        ctx.moveTo(centerX, centerY - symbolHeight * 0.45);
        ctx.lineTo(centerX, centerY + symbolHeight * 0.15);

        // 底部圆点（接触圆形边缘）
        ctx.arc(centerX, centerY + symbolHeight * 0.3, lineWidth / 2, 0, Math.PI * 2);
        ctx.stroke();
    }

    private drawCheckmarkEffect(
        ctx: CanvasRenderingContext2D,
        width: number,
        height: number
    ) {
        // 精确贴边对勾
        const checkSize = Math.min(width, height) * 0.5;
        const radius = checkSize / 2;
        const baseX = width - radius;
        const baseY = height - radius;

        ctx.strokeStyle = 'rgba(0, 250, 154, 0.9)'; // 荧光绿
        ctx.lineWidth = checkSize / 5; // 加粗50%
        ctx.lineCap = 'round';
        ctx.beginPath();
        // 从右下角往左上延伸的对勾
        ctx.moveTo(baseX - checkSize * 0.15, baseY - checkSize * 0.05);
        ctx.lineTo(baseX, baseY + checkSize * 0.1);
        ctx.lineTo(baseX + checkSize * 0.3, baseY - checkSize * 0.25);
        ctx.stroke();
    }

    private updateFavicon(canvas: HTMLCanvasElement) {
        try {
            this.linkElement.href = canvas.toDataURL('image/png');
        } catch (error) {
            console.error('Failed to update favicon:', error);
        }
    }

    private loadImage(src: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            if (!src) {
                reject(new Error('Favicon source is empty'));
                return;
            }

            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = (e) => reject(new Error('Failed to load favicon image'));
            img.crossOrigin = 'anonymous';
            img.src = src;
        });
    }
}