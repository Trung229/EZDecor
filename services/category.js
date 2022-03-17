const categoryModel = require('../models/category');
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
    const category = await categoryModel.find();
    return category;
}

exports.addCategory = async (category, req) => {
    const isExist = await categoryModel.findOne({ name: category.name });
    if (isExist) {
        return {
            payload: {
                message: "name is exist",
                status: false
            }
        }
    }
    const url = await handleImage(req)
    const newCategory = new categoryModel({ ...category, thumbnail: url, createdAt: Date.now() });
    await newCategory.save();
    return {
        payload: {
            message: "add category is success",
            status: true
        }
    }
}

exports.deleteCategory = async (id) => {
    const check = await categoryModel.deleteOne({ _id: id });
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