const multer = require('multer');
const path = require("path");

const eventStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/event-pics');
    },
    filename: (req, file, cb) => {
        const newFileName = 'event-pic' + Date.now() + path.extname(file.originalname);
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
const uploadEventPic = multer({
    storage: eventStorageEngine,
    limits: { fileSize: maxFileSize },
    fileFilter: fileFilterFunction
});




module.exports = uploadEventPic