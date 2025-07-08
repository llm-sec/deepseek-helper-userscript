import WenXiaoBaiChatList from "./WenXiaoBaiChatList";
import sleep from "../../utils/sleep-util";

export class WenXiaoBaiChatMonitor {

    static async init() {
        while (true) {
            const chatList = await WenXiaoBaiChatList.getChatList();
            await sleep(1000);
            if (chatList.length) {
                console.log(chatList);
                debugger;
            }
        }
    }

}