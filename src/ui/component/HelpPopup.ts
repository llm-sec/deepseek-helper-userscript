export default class HelpPopup {

    private innerHTML: string

    constructor() {
        this.innerHTML = `
            <div class="popup-content">
                <span class="popup-close">&times;</span>
                <h3>帮助</h3>
                <div style="text-align: center; margin-top: 30px;">
                    <img src="https://cc11001100.github.io/images/wechat-qrcode.png" 
                         alt="微信二维码" 
                         style="width: 200px; height: 200px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <p style="margin-top: 20px; color: #666;">有问题请加作者微信反馈</p>
                </div>
            </div>
        `;
    }

    show(popup: HTMLElement) {
        popup.innerHTML = this.innerHTML;
    }

}