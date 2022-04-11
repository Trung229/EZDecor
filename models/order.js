const mongoose = require('mongoose');
const schema = mongoose.Schema;
const ObjectId = schema.ObjectId;


const orderSchema = new schema({
    id: { type: ObjectId },
    Address: { type: String },
    products_id: [{
        product_id: { type: schema.Types.ObjectId, ref: "product" },
    }],
    transportation: {
        name: { type: String },
        price: { type: String }
    },
    price: { type: String },
    voucher: { type: Number },
    payment: {
        name: { type: String }
    },
    customer_id: { type: schema.Types.ObjectId, ref: "user" },
    status: { type: String },
    date: { type: String },
})

module.exports = mongoose.model('order', orderSchema)