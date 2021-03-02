import { generateUuid4 } from "../utils/RandomUtils";
import { User } from "./User";

// TODO Needs heavy rework
export class UserInfo {
	private constructor() {
		this.deviceID = generateUuid4();
	}

	static getInstance() {
		if (!UserInfo.instance) {
			UserInfo.instance = new UserInfo();
		}
		return UserInfo.instance;
	}

	static getUser(): User {
		return UserInfo.getInstance().getUser();
	}

	static getUserID(): string {
		return UserInfo.instance.getUserID();
	}

	setUser(user: User, avatarIdx: number) {
		this.user = user;
		this.user.avatar = avatarIdx;
	}

	getUser(): User {
		return this.user;
	}

	getUserID(): string {
		return this.user.getID();
	}

	getDeviceID(): string {
		return this.deviceID;
	}

	private user: User;
	private readonly deviceID: string;
	private static instance: UserInfo;
}
