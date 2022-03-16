const firebaseAdmin = require("firebase-admin");
const serviceAccount = require('./firebase-auth.json');
const admin = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    storageBucket: "furniture-upload-img.appspot.com"
})

// Cloud storage
const bucket = admin.storage().bucket()

module.exports = {
    bucket
};