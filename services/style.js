const styleModel = require('../models/style');

exports.getAll = async () => {
    const styleFromServer = await styleModel.find();
    return styleFromServer;
}


exports.addStyle = async (style) => {
    const isExist = await styleModel.findOne({name:style.name.toLowerCase()});
    if(isExist) {
        return "name is Exist";
    }
    const newStyle = new styleModel({...style, name:style.name.toLowerCase()});
    await newStyle.save();
    return "add style is success";
}
