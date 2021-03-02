import HomeView from "../components/HomeView";
import LobbyView from "../components/LobbyView";
import { User } from "../models/User";
import { UserInfo } from "../models/UserInfo";
import { generateUuid4 } from "../utils/RandomUtils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HomeScene extends cc.Component {

    @property(HomeView)
    homeView: HomeView = null;

    @property(LobbyView)
    lobbyView: LobbyView = null;

    start() {
        let user = new User(generateUuid4());
        UserInfo.getInstance().setUser(user, "");

        this.initHomeView();
    }

    changeToLobbyView() {
        if (this.homeView) {
            this.homeView.cleanUp();
            this.homeView.hide();
        }

        this.initLobbyView();
    };

    changeToHomeView() {
        if (this.lobbyView) {
            this.lobbyView.cleanUp();
            this.lobbyView.hide();
        }

        this.initHomeView();
    }

    private initHomeView() {
        this.homeView.show();
        this.homeView.init(this);
    }

    private initLobbyView() {
        this.lobbyView.show();
        this.lobbyView.init(this);
    }
}