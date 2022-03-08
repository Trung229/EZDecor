const mongoose = require('mongoose');
const schema = mongoose.Schema;
const ObjectId = schema.ObjectId;


const styleSchema = new schema({
    id:{type:ObjectId},
    name:{type:String},
    description:{type:String},
    images:{type:String},
})

module.exports = mongoose.model('style',styleSchema)