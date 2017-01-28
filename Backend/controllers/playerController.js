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
		});
	}

	getById(id) {
		return this.mongo.selectById(document, id).then((player) => {
			return this._prepareToSend(player);
		});
	}

	insert(player) {
		return this.mongo.insert(new document(player)).then((playerSaved) => {
			return this._prepareToSend(playerSaved);
		});
	}

	update(id, player) {
		return this.mongo.update(document, id, player).then((playerSaved) => {
			return this.getById(id);
		}).bind(this).then((playerSaved) => {
			return this._prepareToSend(playerSaved);
		});
	}

	delete(id) {
		return this.mongo.delete(document, id).then((result) => {
			return result;
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

	login(loginObj) {
		return this.mongo.selectByCriteria(document, {nickname:loginObj.nickname}).then((players) => {
			if (players.length == 0) {
				throw errors.getWrongLogin();
			}
			if (players[0].password !== loginObj.password) {
				throw errors.getWrongLogin();	
			}
			return players[0];
		}).then((result) => {
			return this._prepareToSend(result);
		});
	}
};

module.exports = PlayerController;