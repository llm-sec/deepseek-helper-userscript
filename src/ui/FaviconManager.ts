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
        const indicatorDiameter = Math.min(width, height) * 0.8;
        const radius = indicatorDiameter / 2;
        const centerX = width - (radius * 0.95);
        const centerY = height - (radius * 0.95);

        // 现代渐变背景（从珊瑚红到亮红色）
        const gradient = ctx.createRadialGradient(
            centerX, centerY, radius * 0.4,
            centerX, centerY, radius * 1.1
        );
        gradient.addColorStop(0, '#FF6B6B');
        gradient.addColorStop(1, '#FF4757');

        // 带阴影的底座圆形
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = radius * 0.15;
        ctx.shadowOffsetY = radius * 0.05;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.restore();

        // 金属质感边框
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.96, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = radius * 0.04;
        ctx.stroke();

        // 极简风指针设计
        const lineWidth = radius * 0.12;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';

        // 动态角度计算（模拟自然时钟角度）
        const baseAngle = -Math.PI / 2; // 12点方向基准
        const hourAngle = baseAngle + (Math.PI * 0.3); // 10点方向
        const minuteAngle = baseAngle + (Math.PI * 0.7); // 2点方向

        // 绘制双指针（带投影效果）
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = lineWidth * 0.8;
        ctx.shadowOffsetY = lineWidth * 0.3;

        // 时针（短针）
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + Math.cos(hourAngle) * radius * 0.5,
            centerY + Math.sin(hourAngle) * radius * 0.5
        );
        ctx.stroke();

        // 分针（长针）
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + Math.cos(minuteAngle) * radius * 0.7,
            centerY + Math.sin(minuteAngle) * radius * 0.7
        );
        ctx.stroke();
        ctx.restore();

        // 中心轴承点（提升精致感）
        ctx.beginPath();
        ctx.arc(centerX, centerY, lineWidth * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();
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