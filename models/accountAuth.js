const mongoose = require('mongoose');
const schema = mongoose.Schema;
const ObjectId = schema.ObjectId;


const accountAuthSchema = new schema({
    id:{type:ObjectId},
    email:{type:String},
    numberAuth:{type:String},
    createdAt:{type:Date}
})

module.exports = mongoose.model('account_auth',accountAuthSchema)