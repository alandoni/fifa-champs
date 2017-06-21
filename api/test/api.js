const mongoose = require("mongoose");

const Championship = require('../models/championship');
const Match = require('../models/match');
const Player = require('../models/player');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

const Promise = require("bluebird");

chai.use(chaiHttp);

var agent = chai.request.agent(server);

describe('API Test', () => {

    after((done) => {
        Championship.remove({}, (err) => {
            Match.remove({}, (err) => {
                Player.remove({}, (err) => {
                    done();
                });
            });
        });
    });

    describe('/GET salt', () => {
        it('it should get SALT', (done) => {

            const nickname = "Admin";

            get('/api/salt/' + nickname).then((res) => {
                res.should.have.status(200);
                res.body.should.have.property('salt');
                done(res);
            }).catch((error) => {
                done();
            });
        });
    });

    describe('/POST wrong login', () => {
        it('it should not LOGIN', (done) => {

            const invalidAdmin = {nickname: "AlanDoni", password:"123456"};

            post('/api/login', invalidAdmin).then((res) => {
                done(res);
            }).catch((error) => {
                done();
            });
        });
    });

    describe('/POST login', () => {
        it('it should LOGIN', (done) => {
            login().then((res) => {
                res.should.have.status(200);
                done();
            }).catch((error) => {
                done(error);
            });
        });
    });

    describe('/GET Players', () => {
        it('it should GET all the players', (done) => {
            get('/api/players').then((res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
                done();
            }).catch((error) => {
                done(error);
            });
        });
    });

    describe('/POST player', () => {
        it('it should POST a player ', (done) => {
            const player = {
                nickname: 'joao',
                picture: 'http://i.imgur.com/61hqH6f.jpg'
            }

            login().then((res) => {
                res.should.have.status(200);
                return post('/api/players', player);
            }).then((res2) => {
                res2.should.have.status(200);

                res2.body.should.be.a('object');
                res2.body.should.have.property('nickname').eql('joao');
                res2.body.should.not.have.property('password');

                done();
            }).catch((error) => {
                done(error);
            });
        });
    });

    describe('/POST unauthorized player', () => {
        it('it should NOT POST a player ', (done) => {
            const player = {
                nickname: 'alan',
                picture: 'http://i.imgur.com/61hqH6f.jpg'
            }
            var agent = chai.request.agent(server);

            agent.post('/api/players').send(player).then((res) => {
                res.should.have.status(401);
                done(res.status);
            }).catch((res) => {
                res.should.have.status(401);
                done();
            });
        });
    });

    describe('/GET Players', () => {
        it('it should GET all the players', (done) => {
            get('/api/players').then((res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                res.body[0].should.have.property('nickname').eql('joao');
                res.body[0].should.not.have.property('password');
                done();
            }).catch((error) => {
                done(error);
            });
        });
    });

    describe('/POST/:id Players', () => {
        it('it should Update a player', (done) => {

            const player = {
                nickname: 'alex'
            }
            createPlayer(player).then((res) => {
                var newPlayer = {picture: 'http://i.imgur.com/61hqH6f.jpg'};
                return post('/api/players/' + res.body._id, newPlayer);
            }).then((res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('nickname').eql('alex');
                res.body.should.have.property('picture').eql('http://i.imgur.com/61hqH6f.jpg');
                res.body.should.not.have.property('password');
                done();
            }).catch((error) => {
                done(error);
            })
        });
    });

    describe('/DELETE/:id Players', () => {
        it('it should DELETE a player', (done) => {
            var size = 0;

            get('/api/players').then((res) => {
                res.should.have.status(200);
                size = res.body.length;
                var player = {nickname: 'chris'};
                return createPlayer(player);
            }).then((res) => {
                res.should.have.status(200);
                return del('/api/players/' + res.body._id);
            }).then((res) => {
                res.should.have.status(200);
                return get('/api/players');
            }).then((res) => {
                res.should.have.status(200);
                res.body.length.should.be.eql(size);
                done();
            }).catch((error) => {
                done(error);
            });
        });
    });






    describe('/GET Championships', () => {
        it('it should GET all the championships', (done) => {
            get('/api/championships').then((res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
                done();
            }).catch((error) => {
                done(error);
            });
        });
    });

    describe('/POST Championships', () => {
        it('it should POST a championships ', (done) => {

            createPlayers().then((players) => {
                return createChampionship(players);
            }).then((res) => {
                res.should.have.status(200);

                res.body.should.be.a('object');
                res.body.should.have.property('month').eql(2);
                res.body.should.have.property('year').eql(2017);
                res.body.players.length.should.be.eql(4);
                res.body.players[0].should.not.have.property('password');

                done();
            }).catch((error) => {
                done(error);
            });
        });
    });

    describe('/GET Championships', () => {
        it('it should GET all the Championships', (done) => {
            get('/api/championships').then((res) => {
                res.should.have.status(200);

                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                res.body[0].should.have.property('month').eql(2);
                res.body[0].should.have.property('year').eql(2017);
              done();
            }).catch((error) => {
                done(error);
            });
        });
    });

    describe('/POST/:id Championships', () => {
        it('it should UPDATE a championship ', (done) => {

            createPlayers().then((players) => {
                return createChampionship(players);
            }).then((res) => {
                var championshipUpdate = {isCurrent: true};
                return post('/api/championships/' + res.body._id, championshipUpdate);
            }).then((res) => {
                res.should.have.status(200);
                res.body.should.have.property('isCurrent').eql(true);
                done();
            }).catch((error) => {
                done(error);
            });
        });
    });

    describe('/DELETE/:id Championship', () => {
        it('it should DELETE a championship', (done) => {
            var size = 0;

            get('/api/championships').then((res) => {
                res.should.have.status(200);
                size = res.body.length;
                return createPlayers();
            }).then((players) => {
                return createChampionship(players);
            }).then((res) => {
                res.should.have.status(200);
                return del('/api/championships/' + res.body._id);
            }).then((res) => {
                res.should.have.status(200);
                return get('/api/championships');
            }).then((res) => {
                res.should.have.status(200);
                res.body.length.should.be.eql(size);
                done();
            }).catch((error) => {
                done(error);
            });
        });
    });







    describe('/GET Matches', () => {
        it('it should GET all the matches', (done) => {
            get('/api/matches').then((res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
                done();
            }).catch((error) => {
                done(error);
            });
        });
    });

    describe('/POST/ match', () => {
        it('it should POST a match ', (done) => {
            createPlayers().then((players) => {
                return createMatch(players);
            }).then((res) => {
                res.body.should.be.a('object');
                res.body.should.have.property('player1');

                res.body.player1.should.have.property('nickname').eql('alan');
                res.body.player2.should.not.have.property('password');

                res.body.should.have.property('team2score').eql(0);
                done();
            }).catch((error) => {
                done(error);
            });
        });
    });

    describe('/GET Matches', () => {
        it('it should GET all the matches', (done) => {
            get('/api/matches').then((res) => {
                res.should.have.status(200);

                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                res.body[0].should.have.property('player1');

                res.body[0].player1.should.have.property('nickname').eql('alan');
                res.body[0].player1.should.not.have.property('password');
                done();
            }).catch((error) => {
                done(error);
            });
        });
    });

    describe('/POST/:id match', () => {
        it('it should UPDATE a match ', (done) => {
            createPlayers().then((players) => {
                return createMatch(players);
            }).then((res) => {
                res.should.have.status(200);
                var newMatch = {team2score: 1};
                return post('/api/matches/' + res.body._id, newMatch);
            }).then((res) => {
                res.should.have.status(200);

                res.body.should.be.a('object');
                res.body.should.have.property('player1');

                res.body.player1.should.have.property('nickname').eql('alan');
                res.body.player2.should.not.have.property('password');

                res.body.should.have.property('team2score').eql(1);
                done();
            }).catch((error) => {
                done(error);
            });
        });
    });

    describe('/GET Matches with limit and offset', () => {
        it('it should GET all the matches', (done) => {
            var playersSaved = null;
            createPlayers().then((players) => {
                playersSaved = players;
                return createMatch(playersSaved);
            }).then((match) => {
                return createMatch(playersSaved);
            }).then((match) => {
                return get('/api/matches?limit=1&offset=1');
            }).then((res) => {
                res.should.have.status(200);

                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                res.body[0].should.have.property('player1');
                res.body[0].player1.should.have.property('nickname').eql('alan');
                res.body[0].player1.should.not.have.property('password');
                done();
            }).catch((error) => {
                done(error);
            });
        });
    });

    describe('/GET Final Matches with limit and offset', () => {
        it('it should GET all the matches', (done) => {
            var playersSaved = null;
            createPlayers().then((players) => {
                playersSaved = players;
                return createMatch(playersSaved);
            }).then((match) => {
                return createFinalMatch(playersSaved, true);
            }).then((match) => {
                return get('/api/matches?isFinal=true&limit=1&offset=0');
            }).then((res) => {
                res.should.have.status(200);

                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                res.body[0].should.have.property('isFinal');
                res.body[0].isFinal.should.be.eql(true);
                done();
            }).catch((error) => {
                done(error);
            });
        });
    });

    describe('/DELETE/:id Match', () => {
        it('it should DELETE a Match', (done) => {
            var size = 0;

            get('/api/matches').then((res) => {
                res.should.have.status(200);
                size = res.body.length;
                return createPlayers();
            }).then((players) => {
                return createMatch(players);
            }).then((res) => {
                res.should.have.status(200);
                return del('/api/matches/' + res.body._id);
            }).then((res) => {
                res.should.have.status(200);
                return get('/api/matches');
            }).then((res) => {
                res.should.have.status(200);
                res.body.length.should.be.eql(size);
                done();
            }).catch((error) => {
                done(error);
            });
        });
    });
});

function createPlayers() {
    const players = [];
    players.push({nickname: 'alan', picture: 'http://i.imgur.com/61hqH6f.jpg'});
    players.push({nickname: 'rodrigo'});
    players.push({nickname: 'sergio'});
    players.push({nickname: 'lauro'});

    return createPlayer(players[0]).then((res) => {
        res.should.have.status(200);
        players[0]._id = res.body._id;
        return createPlayer(players[1]);
    }).then((res) => {
        res.should.have.status(200);
        players[1]._id = res.body._id;
        return createPlayer(players[2]);
    }).then((res) => {
        res.should.have.status(200);
        players[2]._id = res.body._id;
        return createPlayer(players[3]);
    }).then((res) => {
        res.should.have.status(200);
        players[3]._id = res.body._id;
        return players;
    });
}

function createPlayer(player) {
    return post('/api/players', player);
}

function createChampionship(players) {
    const championship = {
        month: 2,
        year: 2017,
        players: [players[0]._id,
          players[1]._id,
          players[2]._id,
          players[3]._id],
        matches: null,
        date: new Date(),
        finalMatch: null,
        isCurrent: false
    }
    return post('/api/championships', championship);
}

function createFinalMatch(players, isFinal) {
    const match = {
        player1: players[0]._id,
        player2: players[1]._id,
        player3: players[2]._id,
        player4: players[3]._id,
        team1score: 3,
        team2score: 0,
        date: new Date(),
        championship: null,
        isFinal: isFinal
    };

    return post('/api/matches', match);
}

function createMatch(players) {
    return createFinalMatch(players, false);
}

function login() {
    const admin = {
            nickname : 'admin',
            password : '71e3401a5fdf0203d345362e003636b8'
        }
    return post('/api/login', admin);
}

function post(url, object) {
    return agent.post(url).send(object);
}

function get(url) {
    return agent.get(url);
}

function del(url) {
    return agent.delete(url);
}
