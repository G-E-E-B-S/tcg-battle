import { forEach } from '../models/arrays';
import Dictionary from '../models/Dictionary';
import GameInfo, { CardProps, Teams } from '../models/GameInfo';
import { User } from '../models/User';

const CardValues: Array<CardProps> = GameInfo.cardValues;

export class Game {
    teamMap: Dictionary<Teams, Team>;
    gameWinningTeam: Team;
    turn: Teams;

    constructor(players: User[]) {
        this.turn = Teams.Team1;
        this.initiateTeam(players);
    }

    initiateTeam(players: User[]): void {
        this.teamMap = new Dictionary();

        let membersTeam1: string[] = [];
        let membersTeam2: string[] = [];
        players.forEach(player => {
            if (player.playerTeam == Teams.Team1) {
                membersTeam1.push(player.getID());
            } else if (player.playerTeam == Teams.Team2) {
                membersTeam2.push(player.getID());
            }
        });

        let team1 = new Team(membersTeam1);
        let team2 = new Team(membersTeam2);

        this.teamMap.setValue(Teams.Team1, team1);
        this.teamMap.setValue(Teams.Team2, team2);
    };

    damageReport(teamASum: number, teamBCurrentSum: number) {
        if(teamBCurrentSum == 0) return 100;
        return ((teamBCurrentSum - teamASum) / (teamBCurrentSum)) * 100;
    }

    damageReportForRound(TeamASum: number, TeamBSum: number): number {
        if (TeamBSum == 0) return 100;

        let winningTeam = this.gameWinner(this.teamMap.getValue(Teams.Team1), this.teamMap.getValue(Teams.Team2));

        if(winningTeam != null) {
            return -1;
        }

        return ((TeamBSum - TeamASum) / TeamBSum) * 100;
    }

    gameWinner(teamA: Team, teamB: Team): Team {
        if (teamA.getHealth() <= 0) return teamB;
        if (teamB.getHealth() <= 0) return teamA;
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
    private currentRoundTotal: number;

    constructor(playerIds: string[]) {
        for (let i = 0; i < playerIds.length; i++) this.members.push(new Player(playerIds[i], this));
        this.coins = 0;
        this.health = GameInfo.MAX_HEALTH;
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

    setCurrentRoundTotal(currentRoundTotal: number) {
        this.currentRoundTotal = currentRoundTotal;
    }

    getCurrentRoundTotal(): number {
        return this.currentRoundTotal;
    }

    addCurrentRoundTotal(currentVal: number) {
        this.currentRoundTotal += currentVal;
    }
}


export class Player {
    private cards: Dictionary<string, CardProps>;
    private team: Team;
    private id: string;

    constructor(playerId: string, team: Team) {
        this.id = playerId;
        this.team = team;
        this.init();
    }

    init() {
        this.cards = new Dictionary();
        const spawnedCard: CardProps = this.spawnCard();
        for (let i = 0; i < GameInfo.CARDS_PER_PLAYER; i++) this.cards.setValue(spawnedCard.name, spawnedCard);
    }

    getId() {
        return this.id;
    }

    spawnCard(): CardProps {
        let randomNum: number = Math.floor(Math.random() * 30);
        return CardValues[randomNum];
    }

    playCardByName(cardName: string, isBot?: boolean): number {
        if(isBot != null) {
            for(let i = 0; i < CardValues.length; i++) {
                if(CardValues[i].name == cardName) return i;
            }
        }

        if (!this.cards.containsKey(cardName)) return;

        this.cards.remove(cardName);
        const spawnedCard: CardProps = this.spawnCard();
        this.cards.setValue(spawnedCard.name, spawnedCard);

        for(let i = 0; i < CardValues.length; i++) {
            if(CardValues[i].name == cardName) return i;
        }
    }

    healingPotion(healthDiff: number, coinDiff: number) {
        if (this.team.getCoins() < coinDiff) return;

        this.team.increaseHealth(healthDiff);
        this.team.decreaseCoins(coinDiff);
    }
}