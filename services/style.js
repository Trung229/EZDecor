const styleModel = require('../models/style');
const firebase = require('../db_firebase');

async function handleImage(req) {
    if (!req.file) {
        return "Error: No files found"
    }
    const imageName = req.file;
    const finalName = "style_" + Date.now() + "." + imageName.originalname.split(".").pop();
    const blob = firebase.bucket.file(finalName);
    return new Promise((resolve, reject) => {
        const blobWriter = blob.createWriteStream({
            metadata: {
                contentType: imageName.mimetype
            }
        });
        blobWriter.on('error', (err) => {
            reject(err);
        });
        blobWriter.on('finish', async () => {
            await blob.makePublic()
            req.file.firebaseUr = `https://storage.googleapis.com/${process.env.STORAGE_BUCKET}/${finalName}`
            resolve(req.file.firebaseUr)
        });
        blobWriter.end(req.file.buffer)
    });

}


exports.getAll = async () => {
    const styleFromServer = await styleModel.find();
    return styleFromServer;
}


exports.addStyle = async (style, req) => {
    const isExist = await styleModel.findOne({ name: style.name.toLowerCase() });
    if (isExist) {
        return {
            payload: {
                message: "name is exist",
                status: false
            }
        }
    }
    const url = await handleImage(req)
    const newStyle = new styleModel({ ...style, images: url });
    await newStyle.save();
    return {
        payload: {
            message: "add style is success",
            status: true
        }
    };
}


exports.deleteStyle = async (id) => {
    const check = await styleModel.deleteOne({ _id: id });
    if (check.deletedCount) {
        return {
            payload: {
                message: "Style is deleted",
                status: true
            }
        }
    } else {
        return {
            payload: {
                message: "Style is not exist",
                status: false
            }
        }
    }
}

exports.getStyleDetail = async (id) => {
    return await styleModel.findById(id);
}

exports.updateStyle = async (data, req) => {
    let row = await styleModel.findById(data.id);
    row.name = data.name;
    row.description = data.description;
    row.images = !req.file ? row.images : await handleImage(req);
    await row.save();
    return {
        payload: {
            message: "Update success",
            status: true
        }
    }
}