"use strict"

const Promise = require("bluebird");
const errors = require('./../errors');
const util = require('./../utils');
const Mongoose = require('Mongoose');
const ObjectId = Mongoose.Types.ObjectId;

const document = require('./../models/match');

class MatchController {

	constructor(mongo) {
		this.mongo = mongo;
	}
	
	getAll() {
		return this.mongo.selectAll(document).populate("player1 player2 player3 player4").exec().then((matches) => {
			return this._prepareToSend(matches);
		});
	}

	getById(id) {
		return this.mongo.selectById(document, id).populate("player1 player2 player3 player4").exec().then((match) => {
			return this._prepareToSend(match);
		});
	}

	getByChampionship(championshipId) {
		var id = new ObjectId(championshipId)
		return this.mongo.selectByCriteria(document, {championship: id}).populate("player1 player2 player3 player4").exec().then((match) => {
			return this._prepareToSend(match);
		});
	}

	insert(match) {
		return this.mongo.insert(new document(match)).then((matchSaved) => {
			return this.getById(matchSaved._id);
		}).bind(this).then((matchSaved) => {
			return this._prepareToSend(matchSaved);
		});
	}

	update(id, championship) {
		return this.mongo.update(document, id, championship).then((matchSaved) => {
			return this.getById(matchSaved._id);
		}).bind(this).then((matchSaved) => {
			return this._prepareToSend(matchSaved);
		});
	}

	delete(id) {
		return this.mongo.delete(document, id).then((result) => {
			return result;
		});
	}

	_prepareToSend(matchSaved) {
		if (Array.isArray(matchSaved)) {
			for (var match in matchSaved) {
				matchSaved[match].date = util.formatDate(new Date(matchSaved[match].date));
				matchSaved[match].player1.password = undefined;
				matchSaved[match].player2.password = undefined;
				matchSaved[match].player3.password = undefined;
				matchSaved[match].player4.password = undefined;
			}
			return matchSaved;
		}
		matchSaved.date = util.formatDate(new Date(matchSaved.date));
		matchSaved.player1.password = undefined;
		matchSaved.player2.password = undefined;
		matchSaved.player3.password = undefined;
		matchSaved.player4.password = undefined;
		return matchSaved;
	}
};

module.exports = MatchController;