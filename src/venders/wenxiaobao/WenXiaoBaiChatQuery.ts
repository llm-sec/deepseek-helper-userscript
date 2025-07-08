import WenXiaoBaiChat from "./WenXiaoBaiChat";

export default class WenXiaoBaiChatQuery extends WenXiaoBaiChat {

    private queryElement: HTMLElement;

    constructor(queryElement: HTMLElement) {
        super();
        this.queryElement = queryElement;
    }

    getContentText() {
        const element = this.queryElement.querySelector(".Question_question_container__Do96r");
        return element?.textContent?.trim() || null;
    }

    getContentMediaList() {
        // TODO 2025-03-10 01:40:07
    }

}