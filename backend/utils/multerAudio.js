const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

// ensure uploads folder exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'audio');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename   : (req, file, cb) => {
        // keep original base‑name, append a timestamp for uniqueness
        const ext  = path.extname(file.originalname);      // '.wav' | '.mp3'
        const name = path.basename(file.originalname, ext);
        cb(null, `${name}_${Date.now()}${ext}`);
    }
});
module.exports = multer({ storage });
