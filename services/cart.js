const cartModel = require('../models/cart');

exports.createCart = async(id) => {
    const isExist = await cartModel.findOne({ customer_id: id });
    if (isExist) {
        return {
            message: 'Cart is exist',
            return: false,
        }
    } else {
        const newCart = new cartModel();
        newCart.customer_id = id;
        await newCart.save();
        return {
            message: 'Create cart is successful',
            return: true,
        }
    }
}

exports.updateCart = async(id, data) => {
    const cart = await cartModel.findOne({ _id: id });
    if (cart) {
        const myArr = [...cart.products_id];
        const check = myArr.some((item) => {
            return item.product_id.toString() === data.product_id.toString()
        })
        if (myArr.length <= 0 && !check) {
            myArr.push(data);
            cart.products_id = myArr;
            await cart.save();
        } else if (myArr.length > 0 && !check) {
            myArr.push(data);
            cart.products_id = myArr;
            await cart.save();
        } else {
            const newArr = cart.products_id.map((item) => {
                if (item.product_id.toString() === data.product_id.toString()) {
                    return data
                }
                return item;
            })
            cart.products_id = newArr;
            await cart.save();
        }
        return {
            message: 'Add product is successful',
            return: true,
        }
    } else {
        return {
            message: 'Cart is not exist',
            return: false,
        }
    }
}

exports.getAllCart = async(id) => {
    const cart = await cartModel.find({ customer_id: id });
    return cart;
}

exports.deleteItemInCart = async(id, product_id) => {
    const cart = await cartModel.findOne({ _id: id });
    const newArr = cart.products_id.filter((item) => {
        return item.product_id.toString() !== product_id.toString()
    })
    cart.products_id = newArr;
    cart.save()
    return {
        payload: {
            message: 'Cart deleted successfully',
            status: true
        }
    }
}