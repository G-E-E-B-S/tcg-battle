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

	setName(name: string) {
		this.user.name = name;
	}

	setAvatar(avatar: string) {
		if (avatar) {
			// if (GameUtils.isUrl(avatar)) {
			// 	avatar = authAvatar;
			// 	return;
			// }
			this.user.avatar = avatar;
		}
	}

	getAvatar(): string {
		return this.user.avatar;
	}

	setUser(user: User, avatar: string) {
		this.user = user;
		this.user.avatar = avatar;
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
