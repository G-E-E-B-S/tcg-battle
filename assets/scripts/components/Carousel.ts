import { CardProps } from "../models/GameInfo";
import BaseComponent from "./BaseComponent";
import Card from "./Card";
import Cards from "./Cards";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Carousel extends BaseComponent {

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.PageView)
    container: cc.PageView = null;

    @property(cc.Button)
    leftButton: cc.Button = null;

    @property(cc.Button)
    rightButton: cc.Button = null;

    init(initialItems: Array<number>) {
        this.currentIndex = 0;
        this.container.setCurrentPageIndex(this.currentIndex);

        for (let item of initialItems) {
            this.addCard(item);
        }

        this.goToStartIndex();
    }

    addCard(cardIdx: number) {
        let node = cc.instantiate(this.itemPrefab);
        let card = node.getComponent(Card);

        card.setCardProps(cardIdx);

        node.scale = 0.6;
        this.addItem(node);
    }

    goToStartIndex() {
        this.currentIndex = 0;
        this.leftButton.interactable = false;
        this.rightButton.interactable = true;
        this.container.scrollToPage(this.currentIndex, 0.5);
        this.changeInfoInParent();
    }

    onLeft(_event) {
        if (this.currentIndex == 1) {
            this.leftButton.interactable = false;
        }

        this.rightButton.interactable = true;
        this.container.scrollToPage(--this.currentIndex, 0.5);
        this.changeInfoInParent();
    }

    onRight(_event) {
        if (this.currentIndex == 3) {
            this.rightButton.interactable = false;
        }

        this.leftButton.interactable = true;
        this.container.scrollToPage(++this.currentIndex, 0.5);
        this.changeInfoInParent();
    }

    removeCard(card: number) {
        let pages = this.container.getPages();
        for (let item of pages) {
            if (item.getComponent(Card).getIndex() == card) {
                this.container.removePage(item);
                break;
            }
        }
        this.goToStartIndex();
    }

    private addItem(item: cc.Node) {
        this.container.addPage(item);
    }

    private changeInfoInParent() {
        let index = this.container.getPages()[this.currentIndex].getComponent(Card).getIndex();
        this.node.parent.getComponent(Cards).updateAttributes(index);
    }

    private currentIndex: number;
}
