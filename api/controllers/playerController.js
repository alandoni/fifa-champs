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
			return players;
		});
	}

	getByNickname(name) {
		return this.mongo.selectByCriteria(document,{nickname: name}).then((player) => {
			return player;
		});
	}

	getById(id) {
		return this.mongo.selectById(document, id).then((player) => {
			return player;
		});
	}

	insert(player) {
		return this.mongo.insert(new document(player)).then((playerSaved) => {
			return playerSaved;
		});
	}

	update(id, player) {
		return this.mongo.update(document, id, player).then((playerSaved) => {
			return this.getById(id);
		}).bind(this).then((playerSaved) => {
			return playerSaved;
		});
	}

	delete(id) {
		return this.mongo.delete(document, id).then((result) => {
			return result;
		});
	}
};

module.exports = PlayerController;