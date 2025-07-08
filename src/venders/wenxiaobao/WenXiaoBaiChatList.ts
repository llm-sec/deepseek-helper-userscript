import WenXiaoBaiChat from "./WenXiaoBaiChat";
import WenXiaoBaiChatQuery from "./WenXiaoBaiChatQuery";
import WenXiaoBaiChatAnswer from "./WenXiaoBaiChatAnswer";

export default class WenXiaoBaiChatList {

    static async getChatList(): Promise<Array<WenXiaoBaiChat>> {
        const element = document.querySelector(".TurnCard_turn_container__6ntjV");
        if (!element) {
            return [];
        }
        const chatList = new Array<WenXiaoBaiChat>();
        for (let i = 0; i < element.children.length; i++) {
            const childElement = element.children[i];
            if (childElement.getAttribute("class")) {
                // 回答
                const answer = new WenXiaoBaiChatAnswer(childElement as HTMLElement);
                chatList.push(answer);
            } else {
                // 提问
                const query = new WenXiaoBaiChatQuery(childElement as HTMLElement);
                chatList.push(query);
            }
        }
        return chatList;
    }

}