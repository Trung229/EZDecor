const styleServices = require('../services/style');

exports.getAll = function () {
    const style = styleServices.getAll();
    return style;
}

exports.addStyle = async function (data, req) {
    if (!data.name) return "name is empty";
    if (!data.description) return "description is empty";
    const message = styleServices.addStyle({
        name: data.name,
        description: data.description,
        createdAt: Date.now(),
    }, req);
    return message;
}

exports.deleteStyle = (id) => {
    return styleServices.deleteStyle(id);
}

exports.getStyleDetail = (id) => {
    return styleServices.getStyleDetail(id);
}

exports.updateStyle = async (data, req) => {
    if (!data.name) return "name is empty";
    if (!data.description) return "description is empty";
    const message = styleServices.updateStyle(data, req);
    return message;
}