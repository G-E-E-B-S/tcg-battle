import HomeView from "../components/HomeView";
import LobbyView from "../components/LobbyView";
import GameInfo from "../models/GameInfo";
import { User } from "../models/User";
import { UserInfo } from "../models/UserInfo";
import { generateUuid4 } from "../utils/RandomUtils";

const {ccclass, property} = cc._decorator;

const GAME_SCENE = "/scenes/GameScene";

@ccclass
export default class HomeScene extends cc.Component {

    @property(HomeView)
    homeView: HomeView = null;

    @property(LobbyView)
    lobbyView: LobbyView = null;

    @property(cc.SpriteAtlas)
    playerSprites: cc.SpriteAtlas = null;

    start() {
        GameInfo.init();
        GameInfo.sprites = this.playerSprites;

        let user = new User(generateUuid4());
        UserInfo.getInstance().setUser(user);

        this.initHomeView();
    }

    changeToLobbyView() {
        if (this.homeView) {
            this.homeView.hide();
        }

        this.initLobbyView();
    };

    changeToHomeView() {
        if (this.lobbyView) {
            this.lobbyView.hide();
        }

        this.initHomeView();
    }

    startGame() {
        cc.director.preloadScene(GAME_SCENE, null, () => {
            cc.director.loadScene(GAME_SCENE);
        });
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
