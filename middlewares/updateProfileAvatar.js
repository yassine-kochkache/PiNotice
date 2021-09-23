
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

async function fileFilterFunction(req, file, cb) {
    try {
        const allowedExtetions = [".png", ".jpg", ".jpeg"]
        console.log(path.extname(file.originalname));
        const extention = path.extname(file.originalname)

        if (allowedExtetions.includes(extention)) {
            cb(null, true)
        } else {
            return cb(new Error('Wrong file type!!'), false)
        }
    }
    catch (err) {
        console.log(err);
    }
}
const uploadAvatar = multer(
    {
        storage: avatarStorageEngine,
        limits: { fileSize: maxFileSize },
        fileFilter: fileFilterFunction,
    }
);




module.exports = uploadAvatar