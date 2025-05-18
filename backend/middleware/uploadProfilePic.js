const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the directory exists
const dir = path.join(__dirname, '../uploads/profilePics');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}-profilePic${ext}`;
        cb(null, filename);
    }
});

const uploadProfilePic = multer({ storage });

module.exports = uploadProfilePic;
