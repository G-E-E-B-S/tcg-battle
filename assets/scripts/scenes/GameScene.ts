import Abilities from "../components/Abilities";
import Cards from "../components/Cards";
import ProfilePic from "../components/ProfilePic";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameScene extends cc.Component {

    @property(cc.Node)
    timerNode: cc.Node = null;

    @property(cc.Node)
    teamHealth: cc.Node = null;

    @property(cc.Node)
    oppHealth: cc.Node = null;

    @property([cc.Node])
    teamCardSlots: Array<cc.Node> = [];

    @property([cc.Node])
    oppCardSlots: Array<cc.Node> = [];

    @property([ProfilePic])
    teamProfiles: Array<ProfilePic> = [];

    @property([ProfilePic])
    oppProfiles: Array<ProfilePic> = [];

    @property(Cards)
    cards: Cards = null;

    @property(Abilities)
    abilities: Abilities = null;

    start() {
        this.cards.init(this);
        this.abilities.init(this);
    }


}
