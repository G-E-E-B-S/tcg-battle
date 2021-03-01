export enum Teams {
	None,
	Team1,
	Team2
}

export default class GameInfo {
	// Game Room Properties
	static roomCode: string;
	static playerTeam: Teams;

	static readonly TEAM1_COLOR = new cc.Color(122,214,88,255);
	static readonly TEAM2_COLOR = new cc.Color(224,112,88,255);

	static init() {
		GameInfo.roomCode = "";
		GameInfo.playerTeam = Teams.None;
	}
}
