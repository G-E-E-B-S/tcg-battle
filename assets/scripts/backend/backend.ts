export class backend {

    damageReport(teamASum: number, teamBCurrentSum: number) {
        return ((teamBCurrentSum - teamASum) / (teamBCurrentSum)) * 100;
    }
    
    damageReportForRound(TeamASum: number, TeamBSum: number): number {
        return ((TeamBSum - TeamASum) / TeamBSum) * 100;
    }

    gameWinner(teamA: Team, teamB: Team): Team {
        if(teamA.getHealth() < 0) return teamA;
        if(teamB.getHealth() < 0) return teamB;
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
        for(let i = 0; i < playerNames.length; i++) this.members.push(new Player(playerNames[i], this));
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
    private cards: Set<string>;
    private team: Team;
    private name: string;

    constructor(playerName: string, team: Team) {
        this.name = playerName;
        this.team = team;
        this.init();
    }

    init() {
        this.cards = new Set();
        for(let i = 0; i < 5; i++) this.cards.add(this.spawnCard());
    }

    getName(): string {
        return this.name;
    }

    spawnCard(): string {
        let randomNum: number = Math.floor(Math.random() * 30);
        return cardNumberMapping[randomNum];
    }

    playCardByName(cardName: string): string {
        if(!this.cards.has(cardName)) return;

        let chosenCard: string = this.cards[cardName];
        this.cards.delete(cardName);
        this.cards.add(this.spawnCard());
        return cardList[chosenCard];
    }

    healingPotion(healthDiff: number, coinDiff: number) {
        if(this.team.getCoins() < coinDiff) return;

        this.team.increaseHealth(healthDiff);
        this.team.decreaseCoins(coinDiff);
    }


}

const cardNumberMapping = {
    0: "Deus Vult",
	1: "Cold Steel",
	2: "Golden Rod",
	3: "The Vegan Knight",
	4: "Cupid's Right Hand",
	5: "The Neutral Knight",
	6: "Sir Eggplant",
	7: "OwO",
	8: "Bawk Bawk Boom",
	9: "Probably Evil",
	10: "Comrade Fuzzybottom",
	11: "Definitely Evil",
	12: "The Iron Curtain",
	13: "The Grasshopper",
	14: "The Myopic Knight",
	15: "Diamond Face",
	16: "Wannabe Skeletor",
	17: "The Big Chomp",
	18: "Pointy Head",
	19: "Vader Voice",
	20: "Cliche Merc",
	21: "Poke-a-holes",
	22: "Hell's Umpire",
	23: "Lord Bushybrows",
	24: "Terminator Vibes",
	25: "IHoles",
	26: "Silent But Deadly",
	27: "Not Robocop",
	28: "Igloooz",
	29: "Buzz Buzz Kill"
}

const cardList = {
	"Deus Vult": [490, 346, 402],
	"Cold Steel": [346, 490, 474],
	"Golden Rod": [426, 450, 354],
	"The Vegan Knight": [450, 394, 306],
	"Cupid's Right Hand": [274, 402, 450],
	"The Neutral Knight": [434, 482, 258],
	"Sir Eggplant": [410, 458, 490],
	"OwO": [474, 378, 458],
	"Bawk Bawk Boom": [322, 290, 266],
	"Probably Evil": [290, 274, 330],
	"Comrade Fuzzybottom": [418, 418, 346],
	"Definitely Evil": [482, 474, 370],
	"The Iron Curtain": [362, 258, 466],
	"The Grasshopper": [250, 250, 298],
	"The Myopic Knight": [370, 426, 482],
	"Diamond Face": [386, 282, 290],
	"Wannabe Skeletor": [378, 434, 322],
	"The Big Chomp": [306, 330, 314],
	"Pointy Head": [394, 338, 442],
	"Vader Voice": [466, 498, 378],
	"Cliche Merc": [354, 314, 386],
	"Poke-a-holes": [402, 442, 394],
	"Hell's Umpire": [258, 370, 418],
	"Lord Bushybrows": [266, 306, 250],
	"Terminator Vibes": [298, 266, 410],
	"IHoles": [442, 354, 498],
	"Silent But Deadly": [282, 410, 426],
	"Not Robocop": [458, 322, 434],
	"Igloooz": [330, 466, 338],
	"Buzz Buzz Kill": [314, 298, 362]	
}
