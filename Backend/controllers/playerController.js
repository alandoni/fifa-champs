"use strict"

const Promise = require("bluebird");
const errors = require('./../errors');
const util = require('./../utils');

const document = require('./../models/player');

class PlayerController {

	constructor(mongo) {
		this.mongo = mongo;
	}
	
	getAll() {
		return this.mongo.selectAll(document).then((players) => {
			return this._prepareToSend(players);
		}).catch((error) => {
			console.log(error);
			return error;
		});
	}

	getById(id) {
		return this.mongo.selectById(document, id).then((player) => {
			return this._prepareToSend(player);
		}).catch((error) => {
			console.log(error);
			return error;
		});
	}

	insert(player) {
		return this.mongo.insert(new document(player)).then((playerSaved) => {
			return this._prepareToSend(playerSaved);
		}).bind(this).catch((error) => {
			return error;
		});
	}

	update(id, player) {
		return this.mongo.update(document, id, player).then((playerSaved) => {
			return this.getById(id);
		}).bind(this).then((playerSaved) => {
			return this._prepareToSend(playerSaved);
		}).bind(this).catch((error) => {
			return error;
		});
	}

	delete(id) {
		return this.mongo.delete(document, id).then((result) => {
			return result;
		}).bind(this).catch((error) => {
			return error;
		});
	}

	_prepareToSend(playerSaved) {
		if (Array.isArray(playerSaved)) {
			var players = util.copyObject(playerSaved);
			for (var player in players) {
				players[player].password = undefined;
			}
			return players;
		}

		playerSaved.password = undefined;
		return playerSaved;
	}
};

module.exports = PlayerController;