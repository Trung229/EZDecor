const categoryModel = require('../models/category');
const firebase = require('../db_firebase');

async function deleteImagesOnFireBase(imageName) {
    console.log("my image name: ", imageName);
    const imageNameFirebase = imageName.split("/");
    await firebase.bucket.file(imageNameFirebase[imageNameFirebase.length - 1]).delete();
}


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
        blobWriter.on('finish', async() => {
            await blob.makePublic()
            req.file.firebaseUr = `https://storage.googleapis.com/${process.env.STORAGE_BUCKET}/${finalName}`
            resolve(req.file.firebaseUr)
        });
        blobWriter.end(req.file.buffer)
    });

}


exports.getAll = async() => {
    const category = await categoryModel.find();
    return category;
}

exports.addCategory = async(category, req) => {
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
    const newCategory = new categoryModel({...category, thumbnail: url, createdAt: Date.now() });
    await newCategory.save();
    return {
        payload: {
            message: "add category is success",
            status: true
        }
    }
}

exports.deleteCategory = async(id) => {
    let row = await styleModel.findById(id);
    await deleteImagesOnFireBase(row.thumbnail);
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

exports.getCategoryDetail = async(id) => {
    return await categoryModel.findById(id);
}

exports.updateCategoryDetail = async(data, req) => {
    let row = await categoryModel.findById(data.id);
    await deleteImagesOnFireBase(row.thumbnail);
    row.name = data.name;
    row.thumbnail = !req.file ? row.thumbnail : await handleImage(req);
    await row.save();
    return {
        payload: {
            message: "Update success",
            status: true
        }
    }
}