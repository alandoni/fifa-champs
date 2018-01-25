export class Statistics {
    player;
    matches;
    victories;
    ties;
    defeats;
    goals;
    concededGoals;
    goalBalance;
    goalsPerMatch;
    concededGoalsPerMatch;
    score;
    percent;

    constructor() {
        this.matches = 0;
        this.victories = 0;
        this.ties = 0;
        this.defeats = 0;
        this.goals = 0;
        this.concededGoals = 0;
        this.goalBalance = 0;
        this.goalsPerMatch = 0;
        this.concededGoalsPerMatch = 0;
        this.score = 0;
        this.percent = 0;
    }
}
