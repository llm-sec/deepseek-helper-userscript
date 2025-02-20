import TencentYuanBaoChat from "./TencentYuanBaoChat";

/**
 * 当前页面上的会话列表
 */
export default class TencentYuanBaoChatList {

    /**
     * 获取页面上的聊天列表
     */
    getChatList() {
        const chatElementList = document.querySelectorAll(".agent-chat__list__content .agent-chat__list__item");
        const chatList: Array<TencentYuanBaoChat> = new Array<TencentYuanBaoChat>;
        if (!chatElementList) {
            return chatList;
        }
        for (let i = 0; i < chatElementList.length; i++) {
            const chatElement = chatElementList.item(i);
            const chat = new TencentYuanBaoChat(chatElement as HTMLElement);
            chatList.push(chat);
        }
        return chatList;
    }

    /**
     * 获取页面上聊天列表中的最后一条
     */
    getLastChat() {
        const chatElement = document.querySelector(".agent-chat__list__content .agent-chat__list__item.agent-chat__list__item--last");
        if (!chatElement) {
            return null;
        }
        return new TencentYuanBaoChat(chatElement as HTMLElement);
    }

}