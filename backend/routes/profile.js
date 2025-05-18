const r = require('express').Router();
const { authMiddleware } = require('../middleware/auth');
const c = require('../controllers/profileController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure profilePics folder exists
const dir = './uploads/profilePics';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-profilePic${ext}`);
    }
});
const upload = multer({ storage });

r.get('/', authMiddleware, c.getProfile);
r.put('/', authMiddleware, upload.single('profilePic'), c.updateProfile);

module.exports = r;
