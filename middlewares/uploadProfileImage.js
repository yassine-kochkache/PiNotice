
const multer = require('multer');
const path = require("path");
const User = require('../models/userSchema');

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
        const userVerif = await User.findOne({ email: req.body.email })
        const allowedExtetions = [".png", ".jpg", ".jpeg"]
        const extention = path.extname(file.originalname)


        if (allowedExtetions.includes(extention) && !userVerif) {
            cb(null, true)
        } else if (userVerif) {
            return cb(new Error('This user exists!!'), false)
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