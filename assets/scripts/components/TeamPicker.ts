import { Teams } from "../models/GameInfo";
import { UserInfo } from "../models/UserInfo";
import BaseComponent from "./BaseComponent";
import LobbyView from "./LobbyView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TeamPicker extends BaseComponent {

	@property(cc.Node)
	team1List: cc.Node = null;

	@property(cc.Node)
	team2List: cc.Node = null;

	@property(cc.Button)
	team1Button: cc.Button = null;

	@property(cc.Button)
	team2Button: cc.Button = null;

	addPlayerToTeam(playerName: string, playerTeam: Teams) {
		let node = new cc.Node(playerName);
		let label = node.addComponent(cc.Label);

		label.string = playerName;

		if (playerTeam == Teams.Team1) {
			this.team1List.addChild(node);
		} else {
			this.team2List.addChild(node);
		}
	}

	disableJoining(team1Count: number, team2Count: number) {
		if (team1Count == 4)
			this.team1Button.interactable = false;

		if (team2Count == 4)
			this.team2Button.interactable = false;
	}

	onTeamPicked(_event, team: string) {
		if(team == Teams.Team1.toString())
			UserInfo.getUser().playerTeam = Teams.Team1;

		if(team == Teams.Team2.toString())
			UserInfo.getUser().playerTeam = Teams.Team2;

		this.node.parent.getComponent(LobbyView).onTeamPicked();
		this.hide();
	}
}
