'use strict'

const errors = require('./../errors');
const util = require('./../utils');

const document = require('./../models/admin');

class AdminController {

    constructor(mongo) {
        this.mongo = mongo;
    }

    getAll() {
        return this.mongo.selectAll(document).then((admins) => {
            return this._prepareToSend(admins);
        });
    }

    getById(id) {
        return this.mongo.selectById(document, id).then((admin) => {
            return this._prepareToSend(admin);
        });
    }

    getByCriteria(criteria) {
        return this.mongo.selectByCriteria(document, criteria).then((admin) => {
            return this._prepareToSend(admin);
        });
    }

    insert(admin) {
        return this.mongo.insert(new document(admin)).then((admin) => {
            return this._prepareToSend(admin);
        });
    }

    update(id, admin) {
        return this.mongo.update(document, id, admin).then(() => {
            return this.getById(id);
        }).bind(this).then((admin) => {
            return this._prepareToSend(admin);
        });
    }

    delete(id) {
        return this.mongo.delete(document, id).then((result) => {
            return result;
        });
    }

    _prepareToSend(adminSaved) {
        if (Array.isArray(adminSaved)) {
            let admins = util.copyObject(adminSaved);
            for (const admin in admins) {
                admins[admin].password = null;
            }
            return admins;
        }
        const admin = util.copyObject(adminSaved);
        admin.password = null;
        return admin;
    }

    login(loginObj) {
        return this.mongo.selectByCriteria(document, { nickname : loginObj.nickname }).then((admins) => {
            if (admins.length == 0) {
                throw errors.getWrongLogin();
            }
            if (admins[0].password !== loginObj.password) {
                throw errors.getWrongLogin();
            }
            return admins[0];
        }).then((result) => {
            return this._prepareToSend(result);
        });
    }
}

module.exports = AdminController;
