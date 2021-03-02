import Dictionary from '../models/Dictionary';
import GameInfo, { CardProps } from '../models/GameInfo';

const CardValues: Array<CardProps> = GameInfo.cardValues;

export class Game {

    damageReport(teamASum: number, teamBCurrentSum: number) {
        return ((teamBCurrentSum - teamASum) / (teamBCurrentSum)) * 100;
    }

    damageReportForRound(TeamASum: number, TeamBSum: number): number {
        return ((TeamBSum - TeamASum) / TeamBSum) * 100;
    }

    gameWinner(teamA: Team, teamB: Team): Team {
        if (teamA.getHealth() < 0) return teamA;
        if (teamB.getHealth() < 0) return teamB;
        return null;
    }

    distributeCoinReward(team: Team, coinReward: number) {
        team.increaseCoins(coinReward);
    }

    distributeHealthReward(team: Team, healthDiff: number) {
        team.increaseHealth(healthDiff);
    }
}

export class Team {
    private members: Player[];
    private coins: number;
    private health: number;

    constructor(playerNames: string[]) {
        for (let i = 0; i < playerNames.length; i++) this.members.push(new Player(playerNames[i], this));
        this.coins = 0;
        this.health = 10;
    }

    getCoins(): number {
        return this.coins;
    }

    getHealth(): number {
        return this.health;
    }

    increaseHealth(diff: number) {
        this.health = this.health + diff;
    }

    decreaseHealth(diff: number) {
        this.health = this.health - diff;
    }

    increaseCoins(diff: number) {
        this.coins = this.coins + diff;
    }

    decreaseCoins(diff: number) {
        this.coins = this.coins - diff;
    }
}


export class Player {
    private cards: Dictionary<string, CardProps>;
    private team: Team;
    private name: string;

    constructor(playerName: string, team: Team) {
        this.name = playerName;
        this.team = team;
        this.init();
    }

    init() {
        this.cards = new Dictionary();
        const spawnedCard: CardProps = this.spawnCard();
        for (let i = 0; i < 5; i++) this.cards.setValue(spawnedCard.name, spawnedCard);
    }

    getName(): string {
        return this.name;
    }

    spawnCard(): CardProps {
        let randomNum: number = Math.floor(Math.random() * 30);
        return CardValues[randomNum];
    }

    playCardByName(cardName: string): string {
        if (!this.cards.containsKey(cardName)) return;

        let chosenCard: string = this.cards[cardName];
        this.cards.remove(cardName);
        const spawnedCard: CardProps = this.spawnCard();
        this.cards.setValue(spawnedCard.name, spawnedCard);
        return chosenCard;
    }

    healingPotion(healthDiff: number, coinDiff: number) {
        if (this.team.getCoins() < coinDiff) return;

        this.team.increaseHealth(healthDiff);
        this.team.decreaseCoins(coinDiff);
    }
}
