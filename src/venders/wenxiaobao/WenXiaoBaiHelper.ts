import WenXiaoBaiChatList from "./WenXiaoBaiChatList";
import sleep from "../../utils/sleep-util";
import {WenXiaoBaiChatMonitor} from "./WenXiaoBaiChatMonitor";

export default class WenXiaoBaiHelper {

    static async init() {
        WenXiaoBaiChatMonitor.init();
    }

}