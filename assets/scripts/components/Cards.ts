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

	@property(cc.Button)
	placeButton: cc.Button = null;

	@property(Carousel)
	cardCarousel: Carousel = null;

	init(gameScene) {
		this.gameScene = gameScene;
	}

	addCards(hand: Array<number>) {
		this.cardCarousel.init(hand);
	}

	addCard(card: number) {
		this.cardCarousel.addCard(card);
	}

	removeCard(card: number) {
		this.cardCarousel.removeCard(card);
	}

	updateAttributes(index: number) {
		this.activeCard = index;

		let val = Math.round(GameInfo.cardValues[index].attributes[0] * (this.isBuffActive ? 1.1 : 1));
		this.att1Label.string = val.toString();
		this.att1Label.node.color = this.isBuffActive ? GameInfo.TEAM1_COLOR : GameInfo.DEFAULT_CARDTEXT;

		val = Math.round(GameInfo.cardValues[index].attributes[1] * (this.isBuffActive ? 1.1 : 1));
		this.att2Label.string = val.toString();
		this.att2Label.node.color = this.isBuffActive ? GameInfo.TEAM1_COLOR : GameInfo.DEFAULT_CARDTEXT;

		val = Math.round(GameInfo.cardValues[index].attributes[2] * (this.isBuffActive ? 1.1 : 1));
		this.att3Label.string = val.toString();
		this.att3Label.node.color = this.isBuffActive ? GameInfo.TEAM1_COLOR : GameInfo.DEFAULT_CARDTEXT;
	}

	enablePlacing() {
		this.placeButton.interactable = true;
	}

	disablePlacing() {
		this.placeButton.interactable = false;
	}

	activateBuff() {
		this.isBuffActive = true;
		this.updateAttributes(this.activeCard);
	}

	deactivateBuff() {
		this.isBuffActive = false;
		this.updateAttributes(this.activeCard);
	}

	onPlaceCard(_event) {
		this.disablePlacing();
		this.gameScene.placeCard(this.activeCard);
	}

	private activeCard: number;
	private gameScene: GameScene;
	private isBuffActive: boolean;
}
