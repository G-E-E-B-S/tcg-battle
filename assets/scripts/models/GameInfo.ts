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
	static roomCode: string;
	static playerTeam: Teams;

	static MAX_HEALTH = 10;
	static TIMER = 20;
	static CARDS_PER_PLAYER = 5;
	static BUFF_POTION_COST = 40;
	static BUFF_INC = 10;
	static DEBUFF_PORTION_COST = 60;
	static DEBUFF_DEC = 15;
	static FLIP_THE_TABLE_COST = 100;

	static readonly TEAM1_COLOR = new cc.Color(122, 214, 88, 255);
	static readonly TEAM2_COLOR = new cc.Color(224, 112, 88, 255);
	static readonly DEFAULT_CARDTEXT = new cc.Color(97, 97, 97, 255);
	static readonly DEFAULT_BOARDTEXT = new cc.Color(39, 39, 39, 255);

	static cardValues: Array<CardProps>;
	static sprites: cc.SpriteAtlas;

	static init() {
		GameInfo.roomCode = "";
		GameInfo.playerTeam = Teams.None;

		cc.resources.load("/jsons/CardValues", cc.JsonAsset, (err, asset) => {
			GameInfo.cardValues = (asset as cc.JsonAsset).json;
		});
	}
}
