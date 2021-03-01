import Dictionary from "../models/Dictionary";
import { Teams } from "../models/GameInfo";
import { User } from "../models/User";

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

	private constructor() {
		this.teamPlayerMap = new Dictionary();
	}

	private teamPlayerMap: Dictionary<Teams, Array<User>>;
	private static instance: GameController;
}
