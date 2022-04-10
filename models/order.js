const mongoose = require('mongoose');
const schema = mongoose.Schema;
const ObjectId = schema.ObjectId;


const orderSchema = new schema({
    id: { type: ObjectId },
    Address: { type: string },
    products_id: [{
        product_id: { type: schema.Types.ObjectId, ref: "product" },
    }],
    transportation: {
        name: { type: string },
        price: { type: string }
    },
    price: { type: string },
    voucher: { type: number },
    payment: {
        name: { type: string }
    },
    customer_id: { type: schema.Types.ObjectId, ref: "user" },
})

module.exports = mongoose.model('order', orderSchema)