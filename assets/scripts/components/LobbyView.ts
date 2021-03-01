import { GameController } from "../controllers/GameController";
import { Teams } from "../models/GameInfo";
import { User } from "../models/User";
import { UserInfo } from "../models/UserInfo";
import HomeScene from "../scenes/HomeScene";
import { generateUuid4, getRandomInt, popRandomElement } from "../utils/RandomUtils";
import BaseComponent from "./BaseComponent";
import ProfilePic from "./ProfilePic";
import TeamPicker from "./TeamPicker";

const {ccclass, property} = cc._decorator;

const botNames = ["Bot1", "Bot2", "Bot3", "Bot4", "Bot5", "Bot6", "Bot7"];

@ccclass
export default class LobbyView extends BaseComponent {

	@property(TeamPicker)
	teamPicker: TeamPicker = null;

	@property(cc.Node)
	team1List: cc.Node = null;

	@property(cc.Node)
	team2List : cc.Node = null;

	@property(cc.Button)
	startButton: cc.Button = null;

	@property(cc.Prefab)
	profilePrefab: cc.Prefab = null;

	init(homeScene: HomeScene) {
		this.homeScene = homeScene;

		this.teamPicker.show();

		for (let i = 0; i < 4; ++i) {
			let bot = new User(generateUuid4());
			bot.name = popRandomElement(botNames);
			bot.playerTeam = getRandomInt(1, 2) == Teams.Team1 ? Teams.Team1 : Teams.Team2;

			GameController.getInstance().addPlayer(bot, bot.playerTeam);
			this.teamPicker.addPlayerToTeam(bot.name, bot.playerTeam);
			this.addPlayer(bot);
		}
		this.teamPicker.disableJoining(GameController.getInstance().getPlayersInTeam(Teams.Team1), GameController.getInstance().getPlayersInTeam(Teams.Team2));
	}

	onTeamPicked() {
		GameController.getInstance().addPlayer(UserInfo.getUser(), UserInfo.getUser().playerTeam);
		this.addPlayer(UserInfo.getUser());

		for (let i = 0; i < 3; ++i) {
			let botName = popRandomElement(botNames);
			let interval = getRandomInt(2, 5);
			setTimeout(() => {
				let bot = new User(generateUuid4());
				bot.name = botName;
				bot.playerTeam = GameController.getInstance().getPlayersInTeam(Teams.Team1) < 4 ? Teams.Team1 : Teams.Team2;

				GameController.getInstance().addPlayer(bot, bot.playerTeam);
				this.addPlayer(bot);

				if (GameController.getInstance().getPlayersInTeam(Teams.Team1) == 4
					&& GameController.getInstance().getPlayersInTeam(Teams.Team2) == 4)
					this.startButton.interactable = true;
			}, interval * 1000);
		}
	}

	onGameStart(_event) {

	}

	cleanUp() {}

	private addPlayer(player: User) {
		let node = cc.instantiate(this.profilePrefab);
		let profile = node.getComponent(ProfilePic);

		profile.setPlayerName(player.name);

		if (player.playerTeam == Teams.Team1)
			this.team1List.addChild(node);
		else
			this.team2List.addChild(node);

	}

	private homeScene: HomeScene;
}
