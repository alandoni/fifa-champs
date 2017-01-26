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
		}).catch((error) => {
			console.log(error);
			return error;
		});
	}

	getById(id) {
		return this.mongo.selectById(document, id).then((player) => {
			return player;
		}).catch((error) => {
			console.log(error);
			return error;
		});
	}

	insert(player) {
		return this.mongo.insert(new document(player)).then((playerSaved) => {
			return playerSaved;
		}).bind(this).catch((error) => {
			return error;
		});
	}

	update(id, player) {
		return this.mongo.update(document, id, player).then((playerSaved) => {
			return playerSaved;
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
};

module.exports = PlayerController;