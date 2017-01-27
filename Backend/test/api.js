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

describe('API Test', () => {

    after((done) => {
        console.log('Removing previous test data');
        Championship.remove({}, (err) => {
            Match.remove({}, (err) => { 
                Player.remove({}, (err) => { 
                    console.log('Removing previous test data with success');
                    done();         
                });        
            });
        });
    });

    describe('/GET Players', () => {
        it('it should GET all the players', (done) => {
            get('/players').then((res) => {
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
                nickname: 'alan',
                picture: 'http://i.imgur.com/61hqH6f.jpg',
                password: '123456'
            }
            createPlayer(player).then((res) => {
                res.should.have.status(200);

                res.body.should.be.a('object');
                res.body.should.have.property('nickname').eql('alan');
                res.body.should.not.have.property('password');

                done();
            }).catch((error) => {
                done(error);
            });
        });
    });

    describe('/GET Players', () => {
        it('it should GET all the players', (done) => {
            get('/players').then((res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                res.body[0].should.have.property('nickname').eql('alan');
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
                return post('/players/' + res.body._id, newPlayer);
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

            get('/players').then((res) => {
                res.should.have.status(200);
                size = res.body.length;
                var player = {nickname: 'chris'};
                return createPlayer(player);
            }).then((res) => {
                res.should.have.status(200);
                return del('/players/' + res.body._id);
            }).then((res) => {
                res.should.have.status(200);
                return get('/players');
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
            get('/championships').then((res) => {
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
            get('/championships').then((res) => {
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
                return post('/championships/' + res.body._id, championshipUpdate);
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

            get('/championships').then((res) => {
                res.should.have.status(200);
                size = res.body.length;
                return createPlayers();
            }).then((players) => {
                return createChampionship(players);
            }).then((res) => {
                res.should.have.status(200);
                return del('/championships/' + res.body._id);
            }).then((res) => {
                res.should.have.status(200);
                return get('/championships');
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
            get('/matches').then((res) => {
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
            get('/matches').then((res) => {
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
                return post('/matches/' + res.body._id, newMatch);
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

    describe('/DELETE/:id Match', () => {
        it('it should DELETE a Match', (done) => {
            var size = 0;

            get('/matches').then((res) => {
                res.should.have.status(200);
                size = res.body.length;
                return createPlayers();
            }).then((players) => {
                return createMatch(players);
            }).then((res) => {
                res.should.have.status(200);
                return del('/matches/' + res.body._id);
            }).then((res) => {
                res.should.have.status(200);
                return get('/matches');
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
    players.push({nickname: 'alan', picture: 'http://i.imgur.com/61hqH6f.jpg', password: '123456'});
    players.push({nickname: 'rodrigo', password: ''});
    players.push({nickname: 'sergio', password: ''});
    players.push({nickname: 'lauro', password: '123456'});

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
    return post('/Players', player);
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
    return post('/championships', championship);
}

function createMatch(players) {
    const match = {
        player1: players[0]._id,
        player2: players[1]._id,
        player3: players[2]._id,
        player4: players[3]._id,
        team1score: 3,
        team2score: 0,
        date: new Date(),
        championship: null
    };

    return post('/matches', match);
}

function post(url, object) {
    return new Promise((resolve, reject) => {
        chai.request(server).post(url).send(object).end((err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

function get(url) {
    return new Promise((resolve, reject) => {
        chai.request(server).get(url).end((err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

function del(url) {
    return new Promise((resolve, reject) => {
        chai.request(server).delete(url).end((err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}
