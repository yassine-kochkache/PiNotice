const multer = require('multer');
const path = require("path");

const avatarStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/avatars');
    },
    filename: (req, file, cb) => {
        const newFileName = 'profile-pic' + Date.now() + path.extname(file.originalname);
        cb(null, newFileName)
    }
});

const maxFileSize = 1 * 1024 * 1024;

function fileFilterFunction(req, file, cb) {
    const allowedExtetions = [".png", ".jpg", ".jpeg"]
    const extention = path.extname(file.originalname)
    if (allowedExtetions.includes(extention)) {
        cb(null, true)
    } else {
        cb(new Error('Wrong file type!!'), false)
    }
}
const uploadAvatar = multer({
    storage: avatarStorageEngine,
    limits: { fileSize: maxFileSize },
    fileFilter: fileFilterFunction
});




module.exports = uploadAvatar