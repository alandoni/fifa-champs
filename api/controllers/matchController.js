"use strict"

const Promise = require("bluebird");
const errors = require('./../errors');
const util = require('./../utils');
const Mongoose = require('mongoose');
const ObjectId = Mongoose.Types.ObjectId;

const document = require('./../models/match');

class MatchController {

	constructor(mongo) {
		this.mongo = mongo;
	}

	getAll() {
		return this.mongo.selectAll(document, { date: -1 }).populate("player1 player2 player3 player4 championship").exec().then((matches) => {
			return this._prepareToSend(matches);
		});
	}

	getById(id) {
		return this.mongo.selectById(document, id).populate("player1 player2 player3 player4 championship").exec().then((match) => {
			return this._prepareToSend(match);
		});
	}

	getByCriteria(criteria) {
		if (criteria.minDate || criteria.maxDate) {
			var minDate = criteria.minDate;
			var maxDate = criteria.maxDate;

			criteria.minDate = undefined;
			criteria.maxDate = undefined;

			criteria.date = {$gte: minDate, $lte: maxDate};
		}

		if (criteria.offset && criteria.limit) {
			var limit = parseInt(criteria.limit);
			criteria.limit = undefined;
			var offset = parseInt(criteria.offset);
			criteria.offset = undefined;
			return this.mongo.selectByCriteriaLimitOffset(document, criteria, limit, offset,  { date: -1 }).populate("player1 player2 player3 player4 championship").exec()
			.then((matches) => {
				return this._prepareToSend(matches);
			});
		} else {
			return this.mongo.selectByCriteria(document, criteria, { date: -1 }).populate("player1 player2 player3 player4 championship").exec()
			.then((matches) => {
				return this._prepareToSend(matches);
			});
		}
	}

	getByChampionship(championshipId, criteria) {
		var id = new ObjectId(championshipId);
		criteria.championship = id;
		return this.getByCriteria(criteria);
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
			var matches = util.copyObject(matchSaved);
			for (var match in matches) {
				matches[match].date = util.formatDate(new Date(matches[match].date));
			}
			return matches;
		}
		matchSaved.date = util.formatDate(new Date(matchSaved.date));
		return matchSaved;
	}
};

module.exports = MatchController;
