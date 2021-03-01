const {ccclass} = cc._decorator;

@ccclass
export default class BaseComponent extends cc.Component {
	show() {
		if (this.node) {
			this.node.active = true;
		}
	}

	hide() {
		if (this.node) {
			this.node.active = false;
		}
	}

	protected dispatchCustomEvent(eventType: any, userData = null, bubbles: boolean = true) {
		if (!cc.isValid(this.node)) {
			return null;
		}
		let customEvent = new cc.Event.EventCustom(eventType, bubbles);
		customEvent.setUserData(userData);
		this.node.dispatchEvent(customEvent);
		return customEvent.getUserData();
	}
}
