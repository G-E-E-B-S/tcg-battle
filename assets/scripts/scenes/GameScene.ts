import Abilities from "../components/Abilities";
import Cards from "../components/Cards";
import GameCard from "../components/GameCard";
import ProfilePic from "../components/ProfilePic";
import { GameController } from "../controllers/GameController";
import GameInfo, { Teams } from "../models/GameInfo";
import { UserInfo } from "../models/UserInfo";
import { getRandomElement, getRandomInt, getRandomIntWithExclusion, playAnimOnce } from "../utils/RandomUtils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameScene extends cc.Component {

    @property(cc.Node)
    timerNode: cc.Node = null;

    @property(cc.Node)
    loader: cc.Node = null;

    @property(cc.Node)
    gameEnd: cc.Node = null;

    @property(cc.Node)
    overlay: cc.Node = null;

    @property(cc.Node)
    mySum: cc.Node = null;

    @property(cc.Node)
    oppSum: cc.Node = null;

    @property(cc.Label)
    roundAttributeLabel: cc.Label = null;

    @property(cc.Node)
    teamHealth: cc.Node = null;

    @property(cc.Node)
    oppHealth: cc.Node = null;

    @property(cc.Node)
    damageCounter: cc.Node = null;

    @property([GameCard])
    teamCardSlots: Array<GameCard> = [];

    @property([GameCard])
    oppCardSlots: Array<GameCard> = [];

    @property([ProfilePic])
    teamProfiles: Array<ProfilePic> = [];

    @property([ProfilePic])
    oppProfiles: Array<ProfilePic> = [];

    @property(Cards)
    cards: Cards = null;

    @property(Abilities)
    abilities: Abilities = null;

    start() {
        this.loader.active = true;

        setTimeout(function() {
            this.loader.active = false;
            let anim = this.node.getComponent(cc.Animation);
            let clip = anim.defaultClip;

            playAnimOnce(anim, clip, this.node, () => {
                this.init();
            })
        }.bind(this), 3000);
    }

    init() {
        this.cards.init(this);
        this.abilities.init(this);
        this.myHand = [];
        this.firstRound = true;
        this.playedCard = false;
        this.turnEndInProgress = false;
        this.myTurn = true;

        this.populatePlayers();
        this.populateHealth();

        this.showRound();
    }

    update(dt) {
        if (this.noOfPlayersDone != 4)
            return;

        if (this.turnEndInProgress)
            return;

        this.stopTimer();
        this.switchPlayer();
    }

    placeCard(cardIdx: number) {
        this.teamCardSlots[0].setCardProps(cardIdx, this.roundAttribute);
        if(this.buffActive)
            this.teamCardSlots[0].enableBuff();
        this.myHand.splice(this.myHand.indexOf(cardIdx), 1);
        ++this.noOfPlayersDone;

        this.playedCard = true;

        let newCard = GameController.getInstance().getNextCard(cardIdx);
        this.myHand.push(newCard);
        this.cards.removeCard(cardIdx);
        this.cards.addCard(newCard);
    }

    activateBuff() {
        this.buffActive = true;
        this.cards.activateBuff();

        this.teamCardSlots[0].enableBuff();
    }

    activateDebuff() {
        this.debuffActive = true;

        this.oppCardSlots.forEach((card) => {
            card.enableDebuff();
        })
    }

    cancelCurrentRound() {
        this.cancelActive = true;
    }

    private populatePlayers() {
        let myTeam = UserInfo.getUser().playerTeam;
        let i =  0, j = 0;
        GameController.getInstance().getPlayers().forEach((player) => {
            if (player.playerTeam == myTeam) {
                let profile = this.teamProfiles[i];
                profile.setPlayerName(player.getID() == UserInfo.getUserID() ? "You" : player.name);
                profile.setProfilePic(player.playerTeam);
                profile.setProfileColor(player.playerTeam);
                ++i;
            } else {
                let profile = this.oppProfiles[j];
                profile.setPlayerName(player.name);
                profile.setProfilePic(player.playerTeam);
                profile.setProfileColor(player.playerTeam);
                ++j;
            }
        });
    }

    private populateHealth() {
        this.teamHealth.getComponent(cc.ProgressBar).progress = 1;
        this.teamHealth.getChildByName("bar").color = UserInfo.getUser().playerTeam == Teams.Team1 ? GameInfo.TEAM1_COLOR : GameInfo.TEAM2_COLOR;
        this.teamHealth.getChildByName("healthLabel").getComponent(cc.Label).string = GameInfo.MAX_HEALTH.toString();

        this.oppHealth.getComponent(cc.ProgressBar).progress = 1;
        this.oppHealth.getChildByName("bar").color = UserInfo.getUser().playerTeam == Teams.Team1 ? GameInfo.TEAM2_COLOR : GameInfo.TEAM1_COLOR;
        this.oppHealth.getChildByName("healthLabel").getComponent(cc.Label).string = GameInfo.MAX_HEALTH.toString();
    }

    private showRound() {
        this.overlay.active = true;
        let label = this.overlay.getChildByName("label").getComponent(cc.Label);
        if (this.myTurn) {
            label.string = "Your Turn";
            this.overlay.color = UserInfo.getUser().playerTeam == Teams.Team1 ? GameInfo.TEAM1_COLOR : GameInfo.TEAM2_COLOR;
        } else {
            label.string = "Opponent's Turn";
            this.overlay.color = UserInfo.getUser().playerTeam == Teams.Team1 ? GameInfo.TEAM2_COLOR : GameInfo.TEAM1_COLOR;
        }

        setTimeout(function() {
            this.overlay.active = false;
            this.roundAttribute = getRandomInt(0, 2);
            this.setRoundAttribute();
            let func = this.firstRound ? this.firstRoundStarted : this.roundStarted;
            this.disableDamageArrows();
            GameController.getInstance().startRound(this.roundAttribute, func.bind(this));
        }.bind(this), 2000);
    }

    private setRoundAttribute() {
        let label = "Round's Attribute: ";
        label += this.roundAttribute == 0 ? "Fight Power" : this.roundAttribute == 1 ? "Vitality" : "Stamina";

        this.roundAttributeLabel.string = label;
    }

    private firstRoundStarted(myHand: Array<number>, currentTurn: Teams) {
        this.myHand = myHand;
        this.firstRound = false;

        this.noOfPlayersDone = 0;
        this.myTurn = true;
        this.otherPlayed = false;
        this.turnEndInProgress = false;
        this.buffActive = false;
        this.debuffActive = false;
        this.playedCard = false;
        this.cancelActive = false;
        this.mySum.active = false;
        this.oppSum.active = false;
        this.cards.addCards(myHand);
        this.cards.enablePlacing();
        this.cards.deactivateBuff();
        this.abilities.toggleAbilities();
        this.slotWaiting(currentTurn);
        this.startTimer();

        console.log("First Round: myTurn?"+this.myTurn);

        this.setupBots(this.myTurn);
    }

    private roundStarted(currentTurn: Teams) {
        this.noOfPlayersDone = 0;
        this.myTurn = UserInfo.getUser().playerTeam == currentTurn;
        this.otherPlayed = false;
        this.turnEndInProgress = false;
        this.buffActive = false;
        this.debuffActive = false;
        this.cancelActive = false;
        this.playedCard = false;
        this.mySum.active = false;
        this.oppSum.active = false;
        this.cards.deactivateBuff();
        this.slotWaiting(currentTurn);

        if (this.myTurn) {
            this.cards.enablePlacing();
            this.abilities.toggleAbilities();
        } else {
            this.cards.disablePlacing();
            this.abilities.toggleAbilities(false);
        }
        this.startTimer();

        console.log("Next Round: myTurn?"+this.myTurn);

        this.setupBots(this.myTurn);
    }

    private slotWaiting(team: Teams) {
        let myTeam = team == UserInfo.getUser().playerTeam ? this.teamCardSlots : this.oppCardSlots;
        let otherTeam = team == UserInfo.getUser().playerTeam ? this.oppCardSlots : this.teamCardSlots;

        myTeam.forEach((cardSlot) => {
            cardSlot.setLabel("Selecting Card...");
        });
        if (!this.otherPlayed) {
            otherTeam.forEach((cardSlot) => {
                cardSlot.setLabel("Waiting for Other Team");
            });
        }
    }

    private setupBots(myTeam: boolean) {
        let start = myTeam ? 1 : 0;
        let slots = myTeam ? this.teamCardSlots : this.oppCardSlots;

        for(let i = start; i < 4; ++i)
            setTimeout(function() {
                slots[i].setCardProps(getRandomIntWithExclusion(0, 29, [7, 8]), this.roundAttribute);

                if (!this.myTurn && this.debuffActive)
                    slots[i].enableDebuff();

                if (this.otherPlayed && !this.cancelActive)
                    this.damageReport.bind(this).call();

                ++this.noOfPlayersDone;
            }.bind(this), getRandomInt(5, 10) * 1000);
    }

    private startTimer() {
        this.timerNode.width = 1020;

        if (this.myTurn)
            this.timerNode.color = UserInfo.getUser().playerTeam == Teams.Team1 ? GameInfo.TEAM1_COLOR : GameInfo.TEAM2_COLOR;
        else
            this.timerNode.color = UserInfo.getUser().playerTeam == Teams.Team1 ? GameInfo.TEAM2_COLOR : GameInfo.TEAM1_COLOR;

        this.timer = setInterval(function (){
            this.timerNode.width -= 51;
        }.bind(this), 1000);

        setTimeout(() => {
            if (!this.playedCard && this.myTurn)
                this.placeCard(getRandomElement(this.myHand));

            clearInterval(this.timer);
            this.timerNode.width = 1020;
        }, GameInfo.TIMER * 1000);
    }

    private stopTimer() {
        clearInterval(this.timer);
        this.timerNode.width = 1020;
    }

    private switchPlayer() {
        this.turnEndInProgress = true;
        if (this.otherPlayed) {
            setTimeout(() => {
                this.endRound();
            }, 2000);
            return;
        }

        this.overlay.active = true;
        let label = this.overlay.getChildByName("label").getComponent(cc.Label);
        if (!this.myTurn) {
            label.string = "Your Turn";
            this.overlay.color = UserInfo.getUser().playerTeam == Teams.Team1 ? GameInfo.TEAM1_COLOR : GameInfo.TEAM2_COLOR;
        } else {
            label.string = "Opponent's Turn";
            this.overlay.color = UserInfo.getUser().playerTeam == Teams.Team1 ? GameInfo.TEAM2_COLOR : GameInfo.TEAM1_COLOR;
        }

        setTimeout(() => {
            this.overlay.active = false;
            this.myTurn = !this.myTurn;
            this.otherPlayed = true;

            console.log("Player Switched: myTurn?" + this.myTurn);
            this.noOfPlayersDone = 0;
            this.setupBots(this.myTurn);

            let team: Teams;
            if (this.myTurn) {
                team = UserInfo.getUser().playerTeam;
                this.cards.enablePlacing();
                this.abilities.toggleAbilities();
            } else {
                team = UserInfo.getUser().playerTeam == Teams.Team1 ? Teams.Team2 : Teams.Team1;
                this.cards.disablePlacing();
                this.abilities.toggleAbilities(false);
            }

            this.startTimer();
            this.slotWaiting(team);
            this.turnEndInProgress = false;
        }, 2000);
    }

    private endRound() {
        let dmg = this.cancelActive ? 0 : this.damageReport();

        console.log("Round Ended: myTurn?"+this.myTurn);
        let health: cc.Node;
        let reward: number;
        let isWinning: boolean;
        if ((this.myTurn && dmg < 0) || (!this.myTurn && dmg > 0)) {
            health = this.teamHealth;
            reward = Math.abs(dmg) * 5;
            isWinning = false;
        } else {
            health = this.oppHealth;
            reward = Math.abs(dmg) * 10;
            isWinning = true;
        }

        let currHealth = parseInt(health.getChildByName("healthLabel").getComponent(cc.Label).string);
        health.getComponent(cc.ProgressBar).progress = (currHealth - Math.abs(dmg)) / GameInfo.MAX_HEALTH;
        health.getChildByName("healthLabel").getComponent(cc.Label).string = (currHealth - Math.abs(dmg)).toString();


        if (currHealth - Math.abs(dmg) <= 0) {
            this.declareGameEnd(isWinning);
            return;
        }

        this.abilities.updateCoins(reward);
        this.showRound();
    }

    private damageReport() {
        let myPower = 0;
        let oppPower = 0;

        let attrIco: Array<cc.SpriteFrame>;
        this.teamCardSlots.forEach((card) =>  {
            if (!attrIco)
                attrIco = card.attributeIcons;

            myPower += card.getCardProp();
        });
        this.mySum.active = true;
        this.mySum.color = UserInfo.getUser().playerTeam == Teams.Team1 ? GameInfo.TEAM1_COLOR : GameInfo.TEAM2_COLOR;
        this.mySum.getChildByName("power_icon").getComponent(cc.Sprite).spriteFrame = attrIco[this.roundAttribute];
        this.mySum.getChildByName("opponentSumlabel").getComponent(cc.Label).string = myPower.toString();

        this.oppCardSlots.forEach((card) => {
            oppPower += card.getCardProp();
        });
        this.oppSum.active = true;
        this.oppSum.color = UserInfo.getUser().playerTeam == Teams.Team1 ? GameInfo.TEAM2_COLOR : GameInfo.TEAM1_COLOR;
        this.oppSum.getChildByName("power_icon").getComponent(cc.Sprite).spriteFrame = attrIco[this.roundAttribute];
        this.oppSum.getChildByName("opponentSumlabel").getComponent(cc.Label).string = oppPower.toString();


        let mine = this.myTurn ? myPower : oppPower;
        let other = this.myTurn ? oppPower : myPower;

        let perc = Math.round(((mine - other) / mine) * 100);
        let dmg: number;
        if (Math.abs(perc) <= 20)
            dmg = 2;
        else if (Math.abs(perc) > 20 && Math.abs(perc) <= 40)
            dmg = 4;
        else
            dmg = 6;

        dmg *= perc < 0 ? -1 : 1;

        let arrow: cc.Node;
        let otherArrow: cc.Node;
        if ((this.myTurn && dmg < 0) || (!this.myTurn && dmg > 0)) {
            arrow = this.damageCounter.getChildByName("arrow_red");
            otherArrow = this.damageCounter.getChildByName("arrow_green");
        } else {
            arrow = this.damageCounter.getChildByName("arrow_green");
            otherArrow = this.damageCounter.getChildByName("arrow_red");
        }
        arrow.active = true;
        otherArrow.active = false;

        arrow.getChildByName("damageLabel").getComponent(cc.Label).string = "-"+Math.abs(dmg).toString();

        return dmg;
    }

    private disableDamageArrows() {
        let arrow = this.damageCounter.getChildByName("arrow_green");
        arrow.active = false;
        arrow = this.damageCounter.getChildByName("arrow_red");
        arrow.active = false;
    }

    private declareGameEnd(isWinning:boolean) {
        this.gameEnd.active = true;

        let label = this.gameEnd.getChildByName("brownOverlay").getChildByName("long_scroll").getChildByName("roundStatus").getComponent(cc.Label);
        label.string = isWinning ? "YOU WON" : "YOU LOST";

        this.gameEnd.getChildByName("brownOverlay").getChildByName("long_scroll").getChildByName("gameWinSprite").active = isWinning;
        this.gameEnd.getChildByName("brownOverlay").getChildByName("long_scroll").getChildByName("gameLoseSprite").active = !isWinning;
    }

    private timer: any;
    private myTurn: boolean;
    private otherPlayed: boolean;
    private turnEndInProgress: boolean;
    private buffActive: boolean;
    private debuffActive: boolean;
    private cancelActive: boolean;
    private playedCard : boolean;
    private roundAttribute: number;
    private myHand: Array<number>;
    private firstRound: boolean;
    private noOfPlayersDone: number;
}
