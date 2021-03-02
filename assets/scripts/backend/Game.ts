import { forEach } from '../models/arrays';
import Dictionary from '../models/Dictionary';
import GameInfo, { CardProps, Teams } from '../models/GameInfo';
import { User } from '../models/User';

const CardValues: Array<CardProps> = GameInfo.cardValues;

export enum ROUND_ATTRIBUTE {
    FIGHT_POWER = 0,
    VITALITY = 1,
    STAMINA = 2,
}

export class Game {
    teamMap: Dictionary<Teams, Team>;
    gameWinningTeam: Team;
    turn: Teams;
    roundAttribute: ROUND_ATTRIBUTE;
    prevRoundScoreTeamA: number = 0;
    prevRoundScoreTeamB: number = 0;

    constructor(players: User[]) {
        this.turn = Teams.Team1;
        this.initiateTeam(players);
    }

    startNewRound(roundAttribute: ROUND_ATTRIBUTE, turn?: Teams) {
        if (turn == null) this.turn = Teams.Team1;
        else this.turn = turn;

        this.roundAttribute = roundAttribute;
        // Initialise team1
        this.teamMap.getValue(Teams.Team1).init();
        // Initialise team2
        this.teamMap.getValue(Teams.Team2).init();
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

        let team1 = new Team(membersTeam1, this);
        let team2 = new Team(membersTeam2, this);

        this.teamMap.setValue(Teams.Team1, team1);
        this.teamMap.setValue(Teams.Team2, team2);
    };

    setTurn(turn: Teams) {
        this.turn = turn;
    }

    damageReport(teamASum: number, teamBCurrentSum: number) {
        if (teamBCurrentSum == 0) return 100;
        return ((teamBCurrentSum - teamASum) / (teamBCurrentSum)) * 100;
    }

    damageReportForRound(TeamASum: number, TeamBSum: number): number {
        if (TeamBSum == 0) return 100;

        let winningTeam = this.gameWinner(this.teamMap.getValue(Teams.Team1), this.teamMap.getValue(Teams.Team2));

        if (winningTeam != null) {
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

    useBuffPotion(user: User) {
        const team = this.teamMap.getValue(user.playerTeam);
        const player: Player = team.getPlayer(user.getID());
        player.useBuffPotion();
    }

    useDeBuffPortion(user: User) {
        const team: Team = this.teamMap.getValue(user.playerTeam);
        const player: Player = team.getPlayer(user.getID());
        player.useDeBuffPotion();
    }

    useFlipTheTablePotion(user: User) {
        const team = this.teamMap.getValue(user.playerTeam);
        const player: Player = team.getPlayer(user.getID());
        player.useFlipTheTablePotion();
    }
}

export class Team {
    private members: Dictionary<string, Player>;
    private coins: number;
    private health: number;
    private currentRoundTotal: number;
    public game: Game;


    constructor(playerIds: string[], game: Game) {
        this.game = game;
        this.members = new Dictionary();
        for (let i = 0; i < playerIds.length; i++) {

            this.members.setValue(playerIds[i], new Player(playerIds[i], this));
        }
        this.coins = 0;
        this.health = GameInfo.MAX_HEALTH;

        this.init();
    }

    init() {
        this.currentRoundTotal = 0;

        this.members.forEach((playerId: string, player: Player) => {
            player.init();
        });
    }

    getPlayer(playerId: string) {
        return this.members.getValue(playerId);
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
    private isBuffPotionActive: boolean;
    private isDeBuffPotionActive: boolean;
    private isFlipTheTablePotionActive: boolean;

    constructor(playerId: string, team: Team) {
        this.id = playerId;
        this.team = team;
        this.init();
    }

    init() {
        this.cards = new Dictionary();
        const spawnedCard: CardProps = this.spawnCard();
        for (let i = 0; i < GameInfo.CARDS_PER_PLAYER; i++) this.cards.setValue(spawnedCard.name, spawnedCard);

        this.isBuffPotionActive = false;
        this.isDeBuffPotionActive = false;
        this.isFlipTheTablePotionActive = false;
    }

    getCardSet(): CardProps[] {
        return this.cards.values();
    }

    getId() {
        return this.id;
    }

    spawnCard(): CardProps {
        let randomNum: number = Math.floor(Math.random() * 30);
        return CardValues[randomNum];
    }

    /**
     * 
     * Return card with buffed value if spell is active
     * 
     */
    getCard(cardName: string) {
        for (let i = 0; i < CardValues.length; i++) {
            if (CardValues[i].name == cardName) {
                if (this.isBuffPotionActive) {
                    let buffedCard: CardProps = CardValues[i];
                    buffedCard.attributes[this.team.game.roundAttribute] += GameInfo.BUFF_INC;
                    this.isBuffPotionActive = false;
                    return buffedCard;
                }
            }
        }
    }


    playCardByName(cardName: string, isBot?: boolean): CardProps {
        if (isBot != null) {
            return this.getCard(cardName);
        }

        if (!this.cards.containsKey(cardName)) return;

        this.cards.remove(cardName);
        const spawnedCard: CardProps = this.spawnCard();
        this.cards.setValue(spawnedCard.name, spawnedCard);

        return this.getCard(cardName);
    }

    healingPotion(healthDiff: number, coinDiff: number): boolean {
        if (this.team.getCoins() < coinDiff) return false;

        this.team.increaseHealth(healthDiff);
        this.team.decreaseCoins(coinDiff);
        return true;
    }

    useBuffPotion(coinDiff: number = GameInfo.BUFF_POTION_COST): boolean {
        if (this.team.getCoins() < coinDiff) return false;
        this.isBuffPotionActive = true;
        this.team.decreaseCoins(coinDiff);
        return true;
    }

    useDeBuffPotion(coinDiff: number = GameInfo.DEBUFF_PORTION_COST): boolean {
        if (this.team.getCoins() < coinDiff) return false;

        this.isDeBuffPotionActive = true;
        this.team.decreaseCoins(coinDiff);
        return true;
    }

    useFlipTheTablePotion(coinDiff: number = GameInfo.FLIP_THE_TABLE_COST): boolean {
        if (this.team.getCoins() < coinDiff) return false;

        this.isFlipTheTablePotionActive = true;
        this.team.decreaseCoins(coinDiff);
        return true;
    };

}
