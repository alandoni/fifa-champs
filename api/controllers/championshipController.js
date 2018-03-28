'use strict'

const util = require('./../utils');

const document = require('./../models/championship');

const Promise = require('bluebird');

class ChampionshipController {

    constructor(mongo) {
        this.mongo = mongo;
    }

    getAll() {
        return this.mongo.selectAll(document).populate('players').exec().then((championships) => {
            return this._prepareToSend(championships);
        });
    }

    getByCriteria(criteria) {
        let populate = {
            path : 'matches',
            populate : [{
                path : 'player1',
                model : 'Player'
            }, {
                path : 'player2',
                model : 'Player'
            }, {
                path : 'player3',
                model : 'Player'
            }, {
                path : 'player4',
                model : 'Player'
            }]
        };

        if (criteria.minDate || criteria.maxDate) {
            let minDate = criteria.minDate;
            let maxDate = criteria.maxDate;

            criteria.minDate = null;
            criteria.maxDate = null;

            criteria.date = { $gte : minDate, $lte : maxDate };
        }

        return Promise.try(() => {
            if (criteria.offset && criteria.limit) {
                let limit = parseInt(criteria.limit);
                criteria.limit = null;
                let offset = parseInt(criteria.offset);
                criteria.offset = null;

                return this.mongo.selectByCriteriaLimitOffset(document, criteria, limit, offset).populate(populate).exec();
            }
            return this.mongo.selectByCriteria(document, criteria).populate(populate).exec();
        }).then((championships) => {
            return this._prepareToSend(championships);
        });
    }

    getById(id) {
        return this.mongo.selectById(document, id).populate({
            path : 'matches',
            populate : [{
                path : 'player1',
                model : 'Player'
            }, {
                path : 'player2',
                model : 'Player'
            }, {
                path : 'player3',
                model : 'Player'
            }, {
                path : 'player4',
                model : 'Player'
            }]
        }).exec().then((championship) => {
            return this._prepareToSend(championship);
        });
    }

    insert(championship) {
        return this.mongo.insert(new document(championship)).then((championshipSaved) => {
            return this._prepareToSend(championshipSaved);
        });
    }

    update(id, championship) {
        return this.mongo.update(document, id, championship).then(() => {
            return this.getById(id);
        }).bind(this).then((championshipSaved) => {
            return this._prepareToSend(championshipSaved);
        });
    }

    delete(id) {
        return this.mongo.delete(document, id).then((result) => {
            return result;
        });
    }

    _prepareToSend(championshipSaved) {
        if (Array.isArray(championshipSaved)) {
            let championships = util.copyObject(championshipSaved);
            for (const championship in championships) {
                championships[championship].date = util.formatDate(new Date(championships[championship].date));
            }
            return championships;
        }
        const championship = util.copyObject(championshipSaved);
        championship.date = util.formatDate(new Date(championship.date));
        return championship;
    }
}

module.exports = ChampionshipController;
