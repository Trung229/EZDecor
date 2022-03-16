const mongoose = require('mongoose');
const schema = mongoose.Schema;
const ObjectId = schema.ObjectId;


const productSchema = new schema({
    id:{type:ObjectId},
    name:{type:String},
    price:{type:String},
    images:[
        {
            url:{type:String}
        }
    ],
    thumbnail:{type:String},
    description:{type:String},
    inventory:{type:Number},
    origin:{type:String},
    quality:{type:String},
    discounts:[
        {
            value:{type:String}
        }
    ],
    admin:{ type: schema.Types.ObjectId, ref:"user" },
    sold:{type:Number},
    styleId:{ type: schema.Types.ObjectId, ref:"style" },
    category:{type: schema.Types.ObjectId, ref:"category"},
    createdAt:{type: Date}
})

module.exports = mongoose.model('product',productSchema)

