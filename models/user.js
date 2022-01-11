const mongoose = require('mongoose');
const schema = mongoose.Schema;
const ObjectId = schema.ObjectId;


const userSchema = new schema({
    id:{type:ObjectId},
    email:{type:String},
    password:{type:String},
    isAdmin:{type:Boolean},
    createdAt:{type:Date},
    avatar:{type:String},
})

module.exports = mongoose.model('user',userSchema)