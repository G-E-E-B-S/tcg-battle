import Dictionary from "../models/Dictionary";
import { Teams } from "../models/GameInfo";
import { User } from "../models/User";
import { UserInfo } from "../models/UserInfo";
import { popRandomElement } from "../utils/RandomUtils";

export class GameController {

	static getInstance() {
		if (!this.instance)
			this.instance = new GameController();

		return this.instance;
	}

	addPlayer(user: User, team: Teams) {
		if (!this.teamPlayerMap.getValue(team))
			this.teamPlayerMap.setValue(team, new Array<User>());

		this.teamPlayerMap.getValue(team).push(user);
	}

	getPlayersInTeam(team: Teams) {
		if (!this.teamPlayerMap.getValue(team))
			return 0;

		return this.teamPlayerMap.getValue(team).length;
	}

	getPlayers() {
		let players = this.teamPlayerMap.getValue(Teams.Team1).concat(this.teamPlayerMap.getValue(Teams.Team2));
		players = players.filter(player => player.getID() != UserInfo.getUserID());
		players.unshift(UserInfo.getUser());
		return players;
	}

	startRound(attribute: number, callback: Function) {
		this.currentTurn = this.currentTurn == Teams.Team1 ? Teams.Team2 : Teams.Team1;

		if (this.firstRound) {
			this.firstRound = false;
			this.currentTurn = UserInfo.getUser().playerTeam;
			this.allCards = Array.from(Array(30).keys()).slice(1);
			this.allCards.unshift(0);
			this.allCards.splice(7, 2);
			console.log("All cards: %j", this.allCards);
			let hand: Array<number> = [];
			for (let i= 0; i < 5; ++i)
				hand.push(popRandomElement(this.allCards));

			callback(hand, this.currentTurn);
		} else {
			callback(this.currentTurn);
		}
	}

	getNextCard(cardIdx: number) {
		this.allCards.push(cardIdx);

		return popRandomElement(this.allCards);
	}

	private constructor() {
		this.teamPlayerMap = new Dictionary()
		this.currentTurn = Teams.None;
	}

	private allCards: Array<number>;
	private currentTurn: Teams;
	private firstRound: boolean = true;
	private teamPlayerMap: Dictionary<Teams, Array<User>>;
	private static instance: GameController;
}
