const categoryServices = require('../services/category');

exports.getAll = function () {
    const category = categoryServices.getAll();
    return category;
}

exports.addCategory = function (data, req) {
    if (!data.name) return "name is empty";
    const message = categoryServices.addCategory({
        name: data.name,
    }, req);
    return message;
}
exports.deleteCategory = (id) => {
    return categoryServices.deleteCategory(id);
}

exports.getCategoryDetail = (id) => {
    return categoryServices.getCategoryDetail(id);
}

exports.updateCategoryDetail = async (data, req) => {
    if (!data.name) return "name is empty";
    if (!data.description) return "description is empty";
    const message = categoryServices.updateCategoryDetail(data, req);
    return message;
}