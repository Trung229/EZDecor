const orderModel = require('../models/order');
const moment = require('moment');
const userModel = require('../models/user');
const cartModel = require('../models/cart');

exports.createOrder = async (order) => {
    if (order.isDelete) {
        const row = await cartModel.findOne({ customer_id: order.customer_id }, (err, doc) => null).clone().catch(function (err, arr) {
            if (err) {
                return {
                    message: 'Wrong format Id',
                    status: false
                }
            } else {
                console.log("my arr: ", arr)
            }
        });
        row.products_id = [];
        row.save();
        console.log("my row:", row);
    }
    const newOrder = new orderModel({ ...order, voucher: 0, status: order.isOnlinePayment ? "submitted" : "request", date: moment(new Date()).format("MM-DD-YYYY HH:mm:ss") });
    await newOrder.save();
    return {
        payload: {
            message: "Create order is success",
            status: true,
            data: newOrder
        }
    };
}

exports.getAll = async () => {
    const order = await orderModel.find();
    return order;
}
exports.updateStatus = async (id) => {
    const order = await orderModel.findOne({ _id: id }, (err, doc) => null).clone().catch(function (err, arr) {
        if (err) {
            return {
                message: 'Wrong format Id',
                status: false
            }
        } else {
            console.log("my arr: ", arr)
        }
    });
    if (order) {
        order.status = "submitted";
        await order.save();
        return {
            payload: {
                message: "Update order is success",
                status: true,
                data: order
            }
        };
    } else {
        return {
            payload: {
                message: "order is not exist",
                status: false,
            }
        };
    }
}

exports.static = async () => {
    const order = await orderModel.find({ status: "submitted" });
    const month = [01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12];
    const newArr = month.map((item) => {
        const myReturn = order.reduce((total, current) => {
            const checker = item < 10 ? "0" + item.toString() : item.toString();
            if (checker === current.date.split(" ")[0].split("-")[0]) {
                const price = current.price;
                return total + parseInt(price)
            }
            return 0;
        }, 0)
        return myReturn;
    })
    return newArr;
}

exports.earnInMonth = async () => {
    const order = await orderModel.find({ status: "submitted" });
    const thisMonth = moment().startOf('day').month();
    const totalMoney = order.reduce((total, current) => {
        if ((thisMonth + 1) === parseInt(current.date.split(" ")[0].split("-")[0])) {
            const price = current.price;
            return total + parseInt(price)
        }
    }, 0)
    return totalMoney;
}

exports.traffic = async () => {
    const user = await userModel.find();
    const totalTraffic = user.reduce((total, current) => {
        if (current.dateActivity) {
            const toDay = moment().startOf("day").format("MM-DD-YYYY HH:mm:ss");
            const checker = moment(current.dateActivity).format("MM-DD-YYYY HH:mm:ss")
            if (toDay === checker || toDay < checker) {
                return total + 1;
            }
        }
        return total;
    }, 0)
    return totalTraffic;
}
exports.orderRequest = async () => {
    const order = await orderModel.find({ status: "request" });
    const totalRequest = order.reduce((total, current) => {
        return total + 1;
    }, 0)
    return totalRequest;
}

exports.totalUserDevice = async () => {
    const user = await userModel.find({ isAdmin: false });
    const totalDevice = user.reduce((total, current) => {
        return total + 1
    }, 0)
    return totalDevice;
}

exports.getOrderByID = async (id) => {
    const order = await orderModel.find({ customer_id: id }, (err, doc) => null).clone().catch(function (err, arr) {
        if (err) {
            return {
                message: 'Wrong format Id',
                status: false
            }
        } else {
            console.log("my arr: ", arr)
        }
    });
    if (order) {
        return order;
    } else {
        return {
            message: 'customer does not have any order',
            status: false
        }
    }
}