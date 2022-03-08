const styleServices = require('../services/style');

exports.getAll = function() {
    const style = styleServices.getAll();
    return style;
}

exports.addStyle = function(style) {
    const message = styleServices.addStyle(style);
    return message;
}