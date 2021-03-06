import { Teams } from "./GameInfo";

export class User {

	constructor(id: string) {
		this.id = id;
	}

	getID(): string {
		return this.id;
	}

	get name(): string {
		return this._name;
	}

	set name(value: string) {
		this._name = value;
	}

	get playerTeam(): Teams {
		return this._playerTeam;
	}

	set playerTeam(value: Teams) {
		this._playerTeam = value;
	}

	private readonly id: string;
	private _name: string;
	private _playerTeam: Teams;
}
