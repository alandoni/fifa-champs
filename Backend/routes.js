"use strict"

const util = require('./utils');
const bodyParser  = require('body-parser');

const URL_CHAMPIONSHIPS = "/championships";
const URL_PLAYERS = "/players";
const URL_LOGIN = "/login";
const URL_MATCHES = "/matches";

const ChampionshipController = require('./controllers/championshipController');
const PlayerController = require('./controllers/playerController');
const MatchController = require('./controllers/matchController');

exports.set = function(app, mongo) {
	app.use(bodyParser.json());

	const championshipController = new ChampionshipController(mongo);
	const playerController = new PlayerController(mongo);
	const matchController = new MatchController(mongo);

	//LOGIN
	app.post(URL_LOGIN, (request, response) => {
		playerController.login().then((result) => {
			response.send(result);
		}).catch((error) => {
			response.status(500).send(error);
		});
	});

	//Championships
	app.get(URL_CHAMPIONSHIPS, (request, response) => {
		championshipController.getAll().then((championshipsList) => {
			response.send(championshipsList);
		}).catch((error) => {
			response.status(500).send(error);
		});
	});

	app.get(URL_CHAMPIONSHIPS + "/:id", (request, response) => {
		var id = request.params.id;
		championshipController.getById(id).then((championshipsList) => {
			response.send(championshipsList);
		}).catch((error) => {
			response.status(500).send(error);
		});
	});

	app.post(URL_CHAMPIONSHIPS, (request, response) => {
		championshipController.insert(request.body).then((championship) => {
			response.send(championship);
		}).catch((error) => {
			response.status(500).send(error);
		});
	});

	app.post(URL_CHAMPIONSHIPS + "/:id", (request, response) => {
		var id = request.params.id;
		championshipController.update(id, request.body).then((championship) => {
			response.send(championship);
		}).catch((error) => {
			response.status(500).send(error);
		});
	});

	app.delete(URL_CHAMPIONSHIPS + "/:id", (request, response) => {
		var id = request.params.id;
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

	app.post(URL_PLAYERS, (request, response) => {
		playerController.insert(request.body).then((player) => {
			response.send(player);
		}).catch((error) => {
			response.status(500).send(error);
		});
	});

	app.post(URL_PLAYERS + "/:id", (request, response) => {
		var id = request.params.id;
		playerController.update(id, request.body).then((player) => {
			response.send(player);
		}).catch((error) => {
			response.status(500).send(error);
		});
	});

	app.delete(URL_PLAYERS + "/:id", (request, response) => {
		var id = request.params.id;

		playerController.delete(id).then((result) => {
			response.send(result);
		}).catch((error) => {
			response.status(500).send(error);
		});
	});

	//Matches
	app.get(URL_MATCHES, (request, response) => {
		matchController.getAll().then((matchesList) => {
			response.send(matchesList);
		}).catch((error) => {
			response.status(500).send(error);
		});
	});

	app.get(URL_MATCHES + "/:championshipId", (request, response) => {
		var championshipId = request.params.championshipId;
		matchController.getByChampionship(championshipId).then((matchesList) => {
			response.send(matchesList);
		}).catch((error) => {
			response.status(500).send(error);
		});
	});

	app.post(URL_MATCHES, (request, response) => {
		matchController.insert(request.body).then((match) => {
			response.send(match);
		}).catch((error) => {
			response.status(500).send(error);
		});
	});

	app.post(URL_MATCHES + "/:id", (request, response) => {
		var id = request.params.id;
		matchController.update(id, request.body).then((match) => {
			response.send(match);
		}).catch((error) => {
			response.status(500).send(error);
		});
	});

	app.delete(URL_MATCHES + "/:id", (request, response) => {
		var id = request.params.id;
		matchController.delete(id).then((result) => {
			response.send(result);
		}).catch((error) => {
			response.status(500).send(error);
		});
	});
};