const mongoose = require('mongoose');
const schema = mongoose.Schema;
const ObjectId = schema.ObjectId;


const categorySchema = new schema({
    id:{type:ObjectId},
    name:{type:String},
    thumbnail:{type:String},
    createdAt:{type: Date}
})

module.exports = mongoose.model('category',categorySchema)