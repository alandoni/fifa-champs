function mockPlayers() {
	var players = [];
	players.push({nickname: 'alan'});
	players.push({nickname: 'chris'});
	players.push({nickname: 'lauro'});
	players.push({nickname: 'rborcat'});
	players.push({nickname: 'junim'});
	players.push({nickname: 'joao'});
	return players;
}

function mockMatches(players) {
	var matches = [];
	matches.push({
		player1: players[0], 
		player2: players[1], 
		player3: players[2], 
		player4: players[3], 
		team1score: 3, 
		team2score: 1,
		date: formatDate(new Date())
	});
	matches.push({
		player1: players[1], 
		player2: players[3], 
		player3: players[2], 
		player4: players[4], 
		team1score: 1, 
		team2score: 3,
		date: formatDate(new Date())
	});

	var date = new Date();
	date.setDate(date.getDate()+1)
	matches.push({
		player1: players[2], 
		player2: players[0], 
		player3: players[3], 
		player4: players[5], 
		team1score: 4, 
		team2score: 0,
		date: formatDate(date)
	});
	return matches;
}