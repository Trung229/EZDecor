const multer = require('multer')
const uploadSingleImage = multer({
  storage: multer.memoryStorage()
})

module.exports = {
    uploadSingleImage
}