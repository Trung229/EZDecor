const mongoose = require('mongoose');
const schema = mongoose.Schema;
const ObjectId = schema.ObjectId;


const cartSchema = new schema({
    id: { type: ObjectId },
    customer_id: { type: schema.Types.ObjectId, ref: "user" },
    products_id: [{
        product_id: { type: schema.Types.ObjectId, ref: "product" },
        quantity: { type: Number }
    }]
})

module.exports = mongoose.model('cart', cartSchema)