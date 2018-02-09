require('bluebird');

module.exports = {
    createPlayers : function(agent) {
        const players = [];
        players.push({ nickname : 'alan', picture : 'http://i.imgur.com/61hqH6f.jpg' });
        players.push({ nickname : 'rodrigo' });
        players.push({ nickname : 'sergio' });
        players.push({ nickname : 'lauro' });

        return this.createPlayer(agent, players[0]).then((res) => {
            res.should.have.status(200);
            players[0]._id = res.body._id;
            return this.createPlayer(agent, players[1]);
        }).then((res) => {
            res.should.have.status(200);
            players[1]._id = res.body._id;
            return this.createPlayer(agent, players[2]);
        }).then((res) => {
            res.should.have.status(200);
            players[2]._id = res.body._id;
            return this.createPlayer(agent, players[3]);
        }).then((res) => {
            res.should.have.status(200);
            players[3]._id = res.body._id;
            return players;
        });
    },

    createPlayer : function(agent, player) {
        return this.post(agent, '/api/players', player);
    },

    createChampionship : function(agent, players) {
        const championship = {
            month : 2,
            year : 2017,
            players : [players[0]._id,
                players[1]._id,
                players[2]._id,
                players[3]._id],
            matches : null,
            date : new Date(),
            finalMatch : null,
            isCurrent : false
        }
        return this.post(agent, '/api/championships', championship);
    },

    createFinalMatch : function(agent, players, isFinal) {
        const match = {
            player1 : players[0]._id,
            player2 : players[1]._id,
            player3 : players[2]._id,
            player4 : players[3]._id,
            team1score : 3,
            team2score : 0,
            date : new Date(),
            championship : null,
            isFinal : isFinal
        };

        return this.post(agent, '/api/matches', match);
    },

    createMatch : function(agent, players) {
        return this.createFinalMatch(agent, players, false);
    },

    login : function(agent) {
        const admin = {
            nickname : 'admin',
            password : '1083fed03a78190c39c39a898f64f46e'
        }
        return this.post(agent, '/api/login', admin);
    },

    post : function(agent, url, object) {
        return agent.post(url).send(object);
    },

    get : function(agent, url) {
        return agent.get(url);
    },

    del : function(agent, url) {
        return agent.delete(url);
    }
}
