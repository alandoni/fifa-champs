const functions = require('./helper');
const Championship = require('../models/championship');
const Match = require('../models/match');
const Player = require('../models/player');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

require('bluebird');

chai.should();
chai.use(chaiHttp);
let agent = chai.request.agent(server);
let token = null;
describe('API Test', () => {
    after((done) => {
        Championship.remove({}, () => {
            Match.remove({}, () => {
                Player.remove({}, () => {
                    done();
                });
            });
        });
    });

    describe('/GET salt', () => {
        it('it should get SALT', (done) => {
            const nickname = 'admin';
            functions.get(agent, '/api/salt/' + nickname).then((res) => {
                res.should.have.status(200);
                res.body.should.have.property('salt');
                done();
            }).catch((error) => {
                done(error);
            });
        });
    });

    describe('/POST wrong login', () => {
        it('it should not LOGIN', (done) => {
            const invalidAdmin = { nickname : 'AlanDoni', password : '123456' };
            functions.post(agent, '/api/login', invalidAdmin).then((res) => {
                done(res);
            }).catch(() => {
                done();
            });
        });
    });

    describe('/POST login', () => {
        it('it should LOGIN', (done) => {
            functions.login(agent).then((res) => {
                res.should.have.status(200);
                res.body.should.have.property('token');
                token = res.body.token;
                done();
            }).catch((error) => {
                done(error);
            });
        });
    });

    describe('/GET Players', () => {
        it('it should GET all the players', (done) => {
            functions.get(agent, '/api/players').then((res) => {
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
                nickname : 'joao',
                picture : 'http://i.imgur.com/61hqH6f.jpg'
            }
            functions.login(agent).then((res) => {
                res.should.have.status(200);
                return functions.post(agent, '/api/players', player);
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

    describe('/POST player with token', () => {
        it('it should POST a player ', (done) => {
            const player = {
                nickname : 'joao',
                picture : 'http://i.imgur.com/61hqH6f.jpg'
            }
            const agent = chai.request.agent(server);
            agent.post('/api/players').set('x-access-token', token).send(player).then((res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('nickname').eql('joao');
                res.body.should.not.have.property('password');
                done();
            }).catch((error) => {
                done(error);
            });
        });
    });

    describe('/POST unauthorized player', () => {
        it('it should NOT POST a player ', (done) => {
            const player = {
                nickname : 'alan',
                picture : 'http://i.imgur.com/61hqH6f.jpg'
            }
            const agent = chai.request.agent(server);
            agent.post('/api/players').send(player).then((res) => {
                res.should.have.status(401);
                done(res.status);
            }).catch((res) => {
                done();
            });
        });
    });

    describe('/POST unauthorized player with token', () => {
        it('it should NOT POST a player ', (done) => {
            const player = {
                nickname : 'alan',
                picture : 'http://i.imgur.com/61hqH6f.jpg'
            }
            const agent = chai.request.agent(server);
            agent.post('/api/players').set('x-access-token', 'token').send(player).then((res) => {
                res.should.have.status(401);
                done(res.status);
            }).catch((res) => {
                done();
            });
        });
    });

    describe('/GET Players', () => {
        it('it should GET all the players', (done) => {
            functions.get(agent, '/api/players').then((res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(2);
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
            const player = { nickname : 'alex' };
            functions.createPlayer(agent, player).then((res) => {
                let newPlayer = { picture : 'http://i.imgur.com/61hqH6f.jpg' };
                return functions.post(agent, '/api/players/' + res.body._id, newPlayer);
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
            let size = 0;
            functions.get(agent, '/api/players').then((res) => {
                res.should.have.status(200);
                size = res.body.length;
                let player = { nickname : 'chris' };
                return functions.createPlayer(agent, player);
            }).then((res) => {
                res.should.have.status(200);
                return functions.del(agent, '/api/players/' + res.body._id);
            }).then((res) => {
                res.should.have.status(200);
                return functions.get(agent, '/api/players');
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
            functions.get(agent, '/api/championships').then((res) => {
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
            functions.createPlayers(agent).then((players) => {
                return functions.createChampionship(agent, players);
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
            functions.get(agent, '/api/championships').then((res) => {
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
            functions.createPlayers(agent).then((players) => {
                return functions.createChampionship(agent, players);
            }).then((res) => {
                let championshipUpdate = { isCurrent : true };
                return functions.post(agent, '/api/championships/' + res.body._id, championshipUpdate);
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
            let size = 0;
            functions.get(agent, '/api/championships').then((res) => {
                res.should.have.status(200);
                size = res.body.length;
                return functions.createPlayers(agent);
            }).then((players) => {
                return functions.createChampionship(agent, players);
            }).then((res) => {
                res.should.have.status(200);
                return functions.del(agent, '/api/championships/' + res.body._id);
            }).then((res) => {
                res.should.have.status(200);
                return functions.get(agent, '/api/championships');
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
            functions.get(agent, '/api/matches').then((res) => {
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
            functions.createPlayers(agent).then((players) => {
                return functions.createMatch(agent, players);
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
            functions.get(agent, '/api/matches').then((res) => {
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
            functions.createPlayers(agent).then((players) => {
                return functions.createMatch(agent, players);
            }).then((res) => {
                res.should.have.status(200);
                let newMatch = { team2score : 1 };
                return functions.post(agent, '/api/matches/' + res.body._id, newMatch);
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
            let playersSaved = null;
            functions.createPlayers(agent).then((players) => {
                playersSaved = players;
                return functions.createMatch(agent, playersSaved);
            }).then(() => {
                return functions.createMatch(agent, playersSaved);
            }).then(() => {
                return functions.get(agent, '/api/matches?limit=1&offset=1');
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
            let playersSaved = null;
            functions.createPlayers(agent).then((players) => {
                playersSaved = players;
                return functions.createMatch(agent, playersSaved);
            }).then(() => {
                return functions.createFinalMatch(agent, playersSaved, true);
            }).then(() => {
                return functions.get(agent, '/api/matches?isFinal=true&limit=1&offset=0');
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
            let size = 0;
            functions.get(agent, '/api/matches').then((res) => {
                res.should.have.status(200);
                size = res.body.length;
                return functions.createPlayers(agent);
            }).then((players) => {
                return functions.createMatch(agent, players);
            }).then((res) => {
                res.should.have.status(200);
                return functions.del(agent, '/api/matches/' + res.body._id);
            }).then((res) => {
                res.should.have.status(200);
                return functions.get(agent, '/api/matches');
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
