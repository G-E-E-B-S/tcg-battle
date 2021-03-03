import GameInfo from "../models/GameInfo";
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
		this.coins = 0;
		this.updateCoins(0);
	}

	toggleAbilities(enable: boolean = true) {
		this.buffButton.interactable = enable;
		this.debuffButton.interactable = enable;
		this.cancelButton.interactable = enable;

		if(enable)
			this.updateCoins(0);
	}

	updateCoins(coins: number) {
		this.coins += coins
		this.teamCoins.string = this.coins.toString();

		this.buffButton.interactable = this.coins  >= 40;
		this.debuffButton.interactable = this.coins  >= 60;
		this.cancelButton.interactable = this.coins  >= 100;
	}

	onBuffAbility(_event) {
		this.buffButton.interactable = false;
		this.coins -= GameInfo.BUFF_POTION_COST;
		this.teamCoins.string = this.coins.toString();

		this.gameScene.activateBuff();
	}

	onDebuffAbility(_event) {
		this.debuffButton.interactable = false;
		this.coins -= GameInfo.DEBUFF_PORTION_COST;
		this.teamCoins.string = this.coins.toString();

		this.gameScene.activateDebuff();
	}

	onCancelAbility(_event) {
		this.cancelButton.interactable = false;
		this.coins -= GameInfo.FLIP_THE_TABLE_COST;
		this.teamCoins.string = this.coins.toString();

		this.gameScene.cancelCurrentRound();
	}

	private gameScene: GameScene;
	private coins: number;
}
