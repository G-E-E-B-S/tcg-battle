import { Teams } from "../models/GameInfo";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ProfilePic extends cc.Component {

    @property(cc.Label)
    playerName: cc.Label = null;

    @property(cc.Sprite)
    profilePic: cc.Sprite = null;

    @property([cc.SpriteFrame])
    profileSprites: Array<cc.SpriteFrame> = [];

    setPlayerName(playerName: string) {
        this.playerName.string = playerName;
    }

    setProfilePic(team: Teams) {
        this.profilePic.spriteFrame = this.profileSprites[team - 1];
    }
}
