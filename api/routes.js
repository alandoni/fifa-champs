'use strict'

const bodyParser  = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const URL_ADMIN = '/api/admin';
const URL_CHAMPIONSHIPS = '/api/championships';
const URL_PLAYERS = '/api/players';
const URL_MATCHES = '/api/matches';
const URL_LOGIN = '/api/login';
const URL_LOGOUT = '/api/logout';
const URL_SALT = '/api/salt/:nickname';
const URL_TEAM_PICK = '/api/team-pick';

const ChampionshipController = require('./controllers/championshipController');
const PlayerController = require('./controllers/playerController');
const MatchController = require('./controllers/matchController');
const AdminController = require('./controllers/adminController');
const teamsJSON = require('./integrations/resources/teamsFifa18.json');
const PassportController = require('./passport');

const Promise = require('bluebird');

exports.set = function(app, mongo, log) {

    const championshipController = new ChampionshipController(mongo);
    const playerController = new PlayerController(mongo);
    const matchController = new MatchController(mongo);
    const adminController = new AdminController(mongo);
    const passportController = new PassportController(adminController, log);

    app.use(bodyParser.urlencoded({
        extended : true
    }));

    app.use(bodyParser.json());

    app.use(cors({
        origin : function (origin, callback) {
            callback(null, true); //bypass
        },
        methods : 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        preflightContinue : false,
        credentials : true,
        optionsSuccessStatus : 204,
        allowedHeaders : ['set-cookie', 'Content-Type', 'cookie', 'cookies', 'connect.sid'],
        exposedHeaders : ['set-cookie', 'Content-Type', 'cookie', 'cookies', 'connect.sid']
    }));

    app.options('*', cors());

    app.use(cookieParser());

    app.use(session({
        secret : 'SEKR37',
        resave : false,
        saveUninitialized : true,
        cookie : { httpOnly : true, maxAge : 1000 * 60 * 60 * 24, secure : false }
    }));

    app.use(passportController.passport.initialize());
    app.use(passportController.passport.session());

    adminController.getAll().then((admins) => {
        if (admins.length == 0) {
            return adminController.insert({ nickname : 'admin', password : '1083fed03a78190c39c39a898f64f46e' });
        }
    }).then((admin) => {
        if (admin) {
            log.debug('Created Admin: ' + admin.nickname);
        }
    });

    function isLoggedIn(request, response, next) {
        passportController.isLoggedIn(request, response, next);
    }

    //ADMIN
    app.post(URL_ADMIN, isLoggedIn, (request, response) => {
        adminController.insert(request.body).then((admin) => {
            response.send(admin);
        }).catch((error) => {
            response.status(500).send(error);
        });
    });

    app.post(URL_ADMIN + '/:id', isLoggedIn, (request, response) => {
        adminController.update(request.params.id, request.body).then((admin) => {
            response.send(admin);
        }).catch((error) => {
            response.status(500).send(error);
        });
    });

    app.get(URL_ADMIN, isLoggedIn, (request, response) => {
        adminController.getAll().then((admins) => {
            response.send(admins);
        }).catch((error) => {
            response.status(500).send(error);
        });
    });

    app.delete(URL_ADMIN + '/:id', isLoggedIn, (request, response) => {
        adminController.delete(request.params.id).then((admin) => {
            response.send(admin);
        }).catch((error) => {
            response.status(500).send(error);
        });
    });

    //LOGIN
    app.post(URL_LOGIN, (request, response, next) => {
        passportController.authenticate(request, response, next);
    });

    app.post(URL_LOGOUT, isLoggedIn, (req, res) => {
        req.logout();
        res.send(true);
    });

    app.get(URL_SALT, (request, response) => {
        adminController.getByCriteria({ nickname : request.params.nickname }).then((users) => {
            const salt = adminController.getSalt(users[0]);
            response.send(salt);
        }).catch((error) => {
            log.error(error);
            response.status(500).send(error);
        });
    });

    //Championships
    app.get(URL_CHAMPIONSHIPS, (request, response) => {
        Promise.try(() => {
            if ((request.query) && (Object.keys(request.query).length)) {
                return championshipController.getByCriteria(request.query);
            }
            return championshipController.getAll();
        }).then((championshipsList) => {
            response.send(championshipsList);
        }).catch((error) => {
            response.status(500).send(error);
        });
    });

    app.get(URL_CHAMPIONSHIPS + '/:id', (request, response) => {
        let id = request.params.id;
        championshipController.getById(id).then((championshipsList) => {
            response.send(championshipsList);
        }).catch((error) => {
            response.status(500).send(error);
        });
    });

    app.post(URL_CHAMPIONSHIPS, isLoggedIn, (request, response) => {
        championshipController.insert(request.body).then((championship) => {
            response.send(championship);
        }).catch((error) => {
            response.status(500).send(error);
        });
    });

    app.post(URL_CHAMPIONSHIPS + '/:id', isLoggedIn, (request, response) => {
        let id = request.params.id;

        championshipController.update(id, request.body).then((championship) => {
            response.send(championship);
        }).catch((error) => {
            response.status(500).send(error);
        });
    });

    app.delete(URL_CHAMPIONSHIPS + '/:id', isLoggedIn, (request, response) => {
        let id = request.params.id;
        championshipController.delete(id).then((result) => {
            response.send(result);
        }).catch((error) => {
            response.status(500).send(error);
        });
    });

    //Players
    app.get(URL_PLAYERS, (request, response) => {
        playerController.getAll().then((playersList) => {
            response.send(playersList);
        }).catch((error) => {
            response.status(500).send(error);
        });
    });

    app.post(URL_PLAYERS, isLoggedIn, (request, response) => {
        playerController.insert(request.body).then((player) => {
            response.send(player);
        }).catch((error) => {
            response.status(500).send(error);
        });
    });

    app.post(URL_PLAYERS + '/:id', isLoggedIn, (request, response) => {
        let id = request.params.id;
        playerController.update(id, request.body).then((player) => {
            response.send(player);
        }).catch((error) => {
            response.status(500).send(error);
        });
    });

    app.delete(URL_PLAYERS + '/:id', isLoggedIn, (request, response) => {
        let id = request.params.id;
        playerController.delete(id).then((result) => {
            response.send(result);
        }).catch((error) => {
            response.status(500).send(error);
        });
    });

    //Matches
    app.get(URL_MATCHES, (request, response) => {
        Promise.try(() => {
            if (request.query) {
                return matchController.getByCriteria(request.query);
            }
            return matchController.getAll();
        }).then((matchesList) => {
            response.send(matchesList);
        }).catch((error) => {
            response.status(500).send(error);
        });
    });

    app.get(URL_MATCHES + '/:id', (request, response) => {
        matchController.getById(request.params.id).then((matchesList) => {
            response.send(matchesList);
        }).catch((error) => {
            response.status(500).send(error);
        });
    });

    app.get(URL_MATCHES + '/championship/:championshipId', (request, response) => {
        let championshipId = request.params.championshipId;
        matchController.getByChampionship(championshipId, request.query).then((matchesList) => {
            response.send(matchesList);
        }).catch((error) => {
            response.status(500).send(error);
        });
    });

    app.post(URL_MATCHES, isLoggedIn, (request, response) => {
        matchController.insert(request.body).then((match) => {
            response.send(match);
        }).catch((error) => {
            response.status(500).send(error);
        });
    });

    app.post(URL_MATCHES + '/:id', isLoggedIn, (request, response) => {
        let id = request.params.id;
        matchController.update(id, request.body).then((match) => {
            response.send(match);
        }).catch((error) => {
            response.status(500).send(error);
        });
    });

    app.delete(URL_MATCHES + '/:id', isLoggedIn, (request, response) => {
        let id = request.params.id;

        matchController.delete(id).then((result) => {
            response.send(result);
        }).catch((error) => {
            response.status(500).send(error);
        });
    });

    app.get(URL_TEAM_PICK, (request, response) => {
        response.send(JSON.stringify(teamsJSON, null, 2));
    });
};
