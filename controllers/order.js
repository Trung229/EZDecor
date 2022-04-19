const orderService = require('../services/order');

exports.createOrder = function (order) {
    const data = orderService.createOrder(order);
    return data;
}

exports.getAll = async function () {
    const data = await orderService.getAll();
    return data;
}

exports.updateStatus = async function (id) {
    const data = await orderService.updateStatus(id);
    return data;
}

exports.static = async function () {
    const data = await orderService.static();
    return data;
}

exports.earnInMonth = async () => {
    const data = await orderService.earnInMonth();
    return data;
}

exports.traffic = async function () {
    const data = await orderService.traffic();
    return data;
}

exports.orderRequest = async function () {
    const data = await orderService.orderRequest();
    return data;
}

exports.totalUserDevice = async function () {
    const data = await orderService.totalUserDevice();
    return data;
}
exports.getOrderByID = async function (id) {
    const data = await orderService.getOrderByID(id);
    return data;
}

exports.getDetailOrder = async function (id) {
    const data = await orderService.getDetailOrder(id);
    return data;
}