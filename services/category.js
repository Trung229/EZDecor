const categoryModel = require('../models/category');

exports.getAll = async () => {
    const category = await categoryModel.find();
    return category;
}

exports.addCategory = async (category) => {
    const isExist = await categoryModel.findOne({name:category.name.toLowerCase()});
    if(isExist) {
        return "name is Exist";
    }
    const newCategory = new categoryModel({...category, name:category.name.toLowerCase()});
    await newCategory.save();
    return "add category is success";
}