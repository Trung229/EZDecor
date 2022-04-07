const mongoose = require('mongoose');
const schema = mongoose.Schema;
const ObjectId = schema.ObjectId;


const userSchema = new schema({
    id: { type: ObjectId },
    name: { type: String },
    email: { type: String },
    password: { type: String },
    isAdmin: { type: Boolean },
    avatar: { type: String },
    token: { type: String },
    dob: { type: Date },
    createdAt: { type: Date },
    phone: { type: Number },
    addresses: [{
        place: { type: String }
    }],
    uid: { type: String },
    dateActivity: { type: Date },
})

module.exports = mongoose.model('user', userSchema)