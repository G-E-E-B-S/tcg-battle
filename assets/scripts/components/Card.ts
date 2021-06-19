import GameInfo from "../models/GameInfo";

const {ccclass, property} = cc._decorator;

const prefix = "3af1e1a5f42bbd10be605f053a7c56af-";

@ccclass
export default class Card extends cc.Component {

    @property(cc.Node)
    cardBG: cc.Node = null;

    @property(cc.Sprite)
    cardPic: cc.Sprite = null;

    @property(cc.Label)
    att1Label: cc.Label = null;

    @property(cc.Label)
    att2Label: cc.Label = null;

    @property(cc.Label)
    att3Label: cc.Label = null;

    @property(cc.Label)
    cardName: cc.Label = null;

    @property(cc.Label)
    desc: cc.Label = null;

    setCardProps(idx: number) {
        this.cardIndex = idx;
        let cardInfo = GameInfo.cardValues[idx];

        this.cardBG.color = this.HEXToRGB(cardInfo.color);

        this.cardPic.spriteFrame = GameInfo.sprites.getSpriteFrame(prefix + idx);

        this.att1Label.string = cardInfo.attributes[0].toString();
        this.att2Label.string = cardInfo.attributes[1].toString();
        this.att3Label.string = cardInfo.attributes[2].toString();

        this.cardName.string = cardInfo.name;

        this.desc.string = cardInfo.tooltip;
    }

    getIndex(): number {
        return this.cardIndex;
    }

    private HEXToRGB(color: string): cc.Color {
        const colors: number[] = [];
        color = color.startsWith("#") ? color.substr(1): color;

        colors.push(parseInt(color.substr(0, 2), 16));
        colors.push(parseInt(color.substr(2, 2), 16));
        colors.push(parseInt(color.substr(4, 2), 16));

        return new cc.Color(colors[0], colors[1], colors[2], 255);
    }

    private cardIndex: number;
}
