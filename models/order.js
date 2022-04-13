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
    isOnlinePayment: { type: Boolean },
    customer_id: { type: schema.Types.ObjectId, ref: "user" },
    status: { type: String },
    date: { type: String },
    name: { type: String },
    phone: { type: String },
    info_payment: {
        vnp_Amount: { type: String },
        vnp_BankCode: { type: String },
        vnp_BankTranNo: { type: String },
        vnp_CardType: { type: String },
        vnp_OrderInfo: { type: String },
        vnp_PayDate: { type: String },
        vnp_ResponseCode: { type: String },
        vnp_TmnCode: { type: String },
        vnp_TransactionNo: { type: String },
        vnp_TransactionStatus: { type: String },
        vnp_TxnRef: { type: String },
    }
})

module.exports = mongoose.model('order', orderSchema)