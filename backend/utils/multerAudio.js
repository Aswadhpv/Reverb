const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads', 'audio');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        const ext  = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext).replace(/[^a-z0-9_\-]/gi, '_');
        cb(null, `${base}_${Date.now()}${ext}`);
    }
});

module.exports = multer({ storage });
