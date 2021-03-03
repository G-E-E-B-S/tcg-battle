import GameInfo from "../models/GameInfo";

const {ccclass, property} = cc._decorator;

const prefix = "3af1e1a5f42bbd10be605f053a7c56af-";

@ccclass
export default class GameCard extends cc.Component {

	@property(cc.Label)
	cardLabel: cc.Label = null;

	@property(cc.Node)
	cardBG: cc.Node = null;

	@property(cc.Sprite)
	profile: cc.Sprite = null;

	@property(cc.Sprite)
	attributeIcon: cc.Sprite = null;

	@property(cc.Label)
	attributeLabel: cc.Label = null;

	@property([cc.SpriteFrame])
	attributeIcons: Array<cc.SpriteFrame> = [];

	setLabel(text: string) {
		this.toggleLabel();
		this.cardLabel.string = text;
	}

	setCardProps(idx: number, attribute: number) {
		this.toggleLabel(false);

		let cardInfo = GameInfo.cardValues[idx];

		this.cardBG.color = this.HEXToRGB(cardInfo.color);

		this.profile.spriteFrame = GameInfo.sprites.getSpriteFrame(prefix + idx);

		this.attributeIcon.spriteFrame = this.attributeIcons[attribute];
		this.cardProp = cardInfo.attributes[attribute];
		this.attributeLabel.string = this.cardProp.toString();
		this.attributeLabel.node.color = GameInfo.DEFAULT_BOARDTEXT;
	}

	getCardProp() {
		if (this.cardLabel.node.active)
			return 0;

		return this.cardProp;
	}

	enableBuff() {
		if (this.cardLabel.node.active)
			return;

		this.cardProp = Math.round(this.cardProp * 1.1);
		this.attributeLabel.string = this.cardProp.toString();
		this.attributeLabel.node.color = GameInfo.TEAM1_COLOR;
	}

	enableDebuff() {
		if (this.cardLabel.node.active)
			return;

		this.cardProp = Math.round(this.cardProp * 0.85);
		this.attributeLabel.string = this.cardProp.toString();
		this.attributeLabel.node.color = GameInfo.TEAM2_COLOR;
	}

	private toggleLabel(enable: boolean = true) {
		this.cardLabel.node.active = enable;

		this.cardBG.active = !enable;
		this.profile.node.parent.active = !enable;
		this.attributeIcon.node.parent.active = !enable;
	}

	private HEXToRGB(color: string): cc.Color {
		const colors: number[] = [];
		color = color.startsWith("#") ? color.substr(1): color;

		colors.push(parseInt(color.substr(0, 2), 16));
		colors.push(parseInt(color.substr(2, 2), 16));
		colors.push(parseInt(color.substr(4, 2), 16));

		return new cc.Color(colors[0], colors[1], colors[2], 255);
	}

	private cardProp: number;
}
