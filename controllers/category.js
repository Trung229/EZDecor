const categoryServices = require('../services/category');

exports.getAll = function() {
    const category = categoryServices.getAll();
    return category;
}

exports.addCategory = function(data, req) {
    if (!data.name) return "name is empty";
    const message = categoryServices.addCategory({
        name: data.name,
    }, req);
    return message;
}
exports.deleteCategory = (id) =>{
    return categoryServices.deleteCategory(id);
}