export class Match {
	player1;
	player2;
	player3;
	player4;
	team1score;
	team2score;
	team1penalties;
	team2penalties;
	date;
	championship;
	isFinal;
	_id;

	constructor() {
		let dateNow = new Date();
		this.date = dateNow;
	}
}
