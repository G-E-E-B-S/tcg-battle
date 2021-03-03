import Abilities from "../components/Abilities";
import Cards from "../components/Cards";
import GameCard from "../components/GameCard";
import ProfilePic from "../components/ProfilePic";
import { GameController } from "../controllers/GameController";
import GameInfo, { Teams } from "../models/GameInfo";
import { UserInfo } from "../models/UserInfo";
import { getRandomElement, getRandomInt, getRandomIntWithExclusion } from "../utils/RandomUtils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameScene extends cc.Component {

    @property(cc.Node)
    timerNode: cc.Node = null;

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
        this.cards.init(this);
        this.abilities.init(this);
        this.myHand = [];
        this.firstRound = true;
        this.playedCard = false;
        this.turnEndInProgress = false;

        this.populatePlayers();
        this.populateHealth();

        this.showRound();
    }

    update(dt) {
        if (this.noOfPlayersDone != 4)
            return;

        if (this.turnEndInProgress)
            return;

        if (this.myTurn)
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

    //TODO shows Round info and then dissipates
    private showRound() {
        setTimeout(function() {
            this.roundAttribute = getRandomInt(0, 2);
            this.setRoundAttribute();
            let func = this.firstRound ? this.firstRoundStarted : this.roundStarted;
            this.disableDamageArrows();
            GameController.getInstance().startRound(this.roundAttribute, func.bind(this));
        }.bind(this), 5000);
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
        this.cards.deactivateBuff();
        this.slotWaiting(currentTurn);

        if (this.myTurn) {
            this.startTimer();
            this.cards.enablePlacing();
            this.abilities.toggleAbilities();
        } else {
            this.cards.disablePlacing();
            this.abilities.toggleAbilities(false);
        }

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
        this.timerNode.active = true;

        let label = this.timerNode.getChildByName("watch").getChildByName("timeLabel").getComponent(cc.Label);
        let cooldown = GameInfo.TIMER;

        this.timer = setInterval(function (){
            label.string = cooldown.toString();
            --cooldown;
        }.bind(this, cooldown), 1000);

        setTimeout(() => {
            if (!this.playedCard)
                this.placeCard(getRandomElement(this.myHand));

            clearInterval(this.timer);
            this.timerNode.active = false;
        }, cooldown * 1000);
    }

    private stopTimer() {
        clearInterval(this.timer);
        this.timerNode.active = false;
    }

    private switchPlayer() {
        this.turnEndInProgress = true;
        if (this.otherPlayed) {
            setTimeout(() => {
                this.endRound();
            }, 2000);
            return;
        }

        this.myTurn = !this.myTurn;
        this.otherPlayed = true;

        console.log("Player Switched: myTurn?"+this.myTurn);
        this.noOfPlayersDone = 0;
        this.setupBots(this.myTurn);

        let team: Teams;
        if(this.myTurn) {
            team = UserInfo.getUser().playerTeam;
            this.cards.enablePlacing();
            this.abilities.toggleAbilities();
            this.startTimer();
        }
        else {
            team = UserInfo.getUser().playerTeam == Teams.Team1 ? Teams.Team2 : Teams.Team1;
            this.cards.disablePlacing();
            this.abilities.toggleAbilities(false);
        }

        this.slotWaiting(team);
        this.turnEndInProgress = false;
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

        this.teamCardSlots.forEach((card) =>  {
            myPower += card.getCardProp();
        });

        this.oppCardSlots.forEach((card) => {
            oppPower += card.getCardProp();
        });

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

    // TODO this should be done with a popup or something
    private declareGameEnd(isWinning:boolean) {

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
