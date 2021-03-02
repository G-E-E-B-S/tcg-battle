import GameInfo from "../models/GameInfo";
import GameScene from "../scenes/GameScene";
import Carousel from "./Carousel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Cards extends cc.Component {

	@property(cc.Label)
	att1Label: cc.Label = null;

	@property(cc.Label)
	att2Label: cc.Label = null;

	@property(cc.Label)
	att3Label: cc.Label = null;

	@property(Carousel)
	cardCarousel: Carousel = null;

	init(gameScene) {
		this.gameScene = gameScene;
	}

	updateAttributes(index: number) {
		this.activeCard = index;
		this.att1Label.string = GameInfo.cardValues[index].attributes[0].toString();
		this.att2Label.string = GameInfo.cardValues[index].attributes[1].toString();
		this.att3Label.string = GameInfo.cardValues[index].attributes[2].toString();
	}

	onPlaceCard(_event) {

	}

	private activeCard: number;
	private gameScene: GameScene;
}
