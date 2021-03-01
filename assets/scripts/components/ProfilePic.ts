const {ccclass, property} = cc._decorator;

@ccclass
export default class ProfilePic extends cc.Component {

    @property(cc.Label)
    playerName: cc.Label = null;

    @property(cc.Sprite)
    profilePic: cc.Sprite = null;

    setPlayerName(playerName: string) {
        this.playerName.string = playerName;
    }
}
