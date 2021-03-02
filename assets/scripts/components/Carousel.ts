import { CardProps } from "../models/GameInfo";
import Card from "./Card";
import Cards from "./Cards";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Carousel extends cc.Component {

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
        this.noOfItems = 0;

        initialItems.forEach((item) => {
            let node = cc.instantiate(this.itemPrefab);
            let card = node.getComponent(Card);

            card.setCardProps(item);

            node.scale = 0.6;
            this.addItem(node);
        });

        this.goToStartIndex();
    }

    goToStartIndex() {
        this.leftButton.interactable = false;
        this.container.setCurrentPageIndex(0);
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
        if (this.currentIndex == this.noOfItems - 2) {
            this.rightButton.interactable = false;
        }

        this.leftButton.interactable = true;
        this.container.scrollToPage(++this.currentIndex, 0.5);
        this.changeInfoInParent();
    }

    private addItem(item: cc.Node) {
        this.container.addPage(item);
        ++this.noOfItems;
    }

    private changeInfoInParent() {
        let index = this.container.getPages()[this.currentIndex].getComponent(Card).getIndex();
        this.node.parent.getComponent(Cards).updateAttributes(index);
    }

    private currentIndex: number;
    private noOfItems: number;
}
