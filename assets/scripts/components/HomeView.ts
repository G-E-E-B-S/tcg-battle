import GameInfo from "../models/GameInfo";
import { UserInfo } from "../models/UserInfo";
import HomeScene from "../scenes/HomeScene";
import BaseComponent from "./BaseComponent";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HomeView extends BaseComponent {

	@property(cc.EditBox)
	playerNameInput: cc.EditBox = null;

	@property(cc.EditBox)
	roomCodeInput: cc.EditBox = null;

	init(homeScene: HomeScene) {
		this.homeScene = homeScene;
	}

	moveToLobby(_event) {
		const roomCode = this.roomCodeInput.string.trim();
		const playerName = this.playerNameInput.string.trim();

		GameInfo.roomCode = roomCode;
		UserInfo.getUser().name = playerName;

		this.homeScene.changeToLobbyView();
	}

	private homeScene: HomeScene;
}
