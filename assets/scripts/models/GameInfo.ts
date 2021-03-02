export enum Teams {
	None,
	Team1,
	Team2
}

export interface CardProps {
	name: string;
	color: string;
	tooltip: string;
	attributes: Array<number>;
}

export default class GameInfo {
	// Game Room Properties
	static roomCode: string;
	static playerTeam: Teams;

	static MAX_HEALTH = 10;
	static CARDS_PER_PLAYER = 5;
	static BUFF_POTION_COST = 25;
	static BUFF_INC = 3;
	static DEBUFF_PORTION_COST = 30;
	static DEBUFF_DEC = 4;
	static FLIP_THE_TABLE_COST = 60;

	static readonly TEAM1_COLOR = new cc.Color(122, 214, 88, 255);
	static readonly TEAM2_COLOR = new cc.Color(224, 112, 88, 255);

	static avatarIndices: number[];
	static cardValues: Array<CardProps>;
	static sprites: cc.SpriteAtlas;

	static init() {
		GameInfo.roomCode = "";
		GameInfo.playerTeam = Teams.None;

		GameInfo.avatarIndices = Array.from(Array(30).keys()).slice(1);

		cc.resources.load("/jsons/CardValues", cc.JsonAsset, (err, asset) => {
			GameInfo.cardValues = (asset as cc.JsonAsset).json;
		});
	}
}
