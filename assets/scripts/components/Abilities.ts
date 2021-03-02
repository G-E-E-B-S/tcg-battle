import GameScene from "../scenes/GameScene";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Abilities extends cc.Component {

	@property(cc.Label)
	teamCoins: cc.Label = null;

	@property(cc.Button)
	buffButton: cc.Button = null;

	@property(cc.Button)
	debuffButton: cc.Button = null;

	@property(cc.Button)
	cancelButton: cc.Button = null;

	init(gameScene) {
		this.gameScene = gameScene;
	}

	updateCoins(coins: number) {
		this.teamCoins.string = coins.toString();

		this.buffButton.interactable = coins  >= 40;
		this.debuffButton.interactable = coins  >= 60;
		this.cancelButton.interactable = coins  >= 100;
	}

	onBuffAbility(_event) {

	}

	onDebuffAbility(_event) {

	}

	onCancelAbility(_event) {

	}

	private gameScene: GameScene;
}
