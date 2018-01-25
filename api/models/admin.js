let Mongoose = require('mongoose');
let Schema   = Mongoose.Schema;

let adminSchema = new Schema({
    nickname : String,
    password : String
});

let Admin = Mongoose.model('Admin', adminSchema);

module.exports = Admin;
