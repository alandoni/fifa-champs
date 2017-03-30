"use strict"

const Promise = require("bluebird");
const Mongoose = require('mongoose');
const ObjectId = Mongoose.Types.ObjectId;
const db = Mongoose.connection;

Mongoose.Promise = Promise;

class MongoController {
	constructor(databaseAddress) {
		console.log('Connecting to MongoDB.')
		Mongoose.connect(databaseAddress);
		db.on('error', console.error);
		db.once('open', function() {
		  console.log("Connected to MongoDB. We're ready to go");
		});
	}

	select(document, criteria, limit, offset, order={}) {
		return document.find(criteria).sort(order).skip(offset).limit(limit);
	}

	selectAll(document, order={}) {
		return document.find().sort(order);
	}

	selectAllLimitOffset(document, limit, offset, order={}) {
		return document.find().sort(order).skip(offset).limit(limit);
	}

	selectByCriteria(document, criteria, order={}) {
		return document.find(criteria).sort(order);
	}

	selectByCriteriaLimitOffset(document, criteria, limit, offset, order={}) {
		return document.find(criteria).sort(order).skip(offset).limit(limit);
	}

	selectById(document, id) {
		return document.findById(id);
	}

	insert(object) {
		return object.save();
	}

	update(document, id, object) {
		return document.findByIdAndUpdate(new ObjectId(id), { $set: object});
	}

	delete(document, id) {
		return document.findById(new ObjectId(id)).remove().exec();
	}
}


module.exports = MongoController;
