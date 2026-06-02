const multer = require("multer");
const path = require("path");
const { ensureUploadDir } = require("../utils/fileHelper");

ensureUploadDir();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "public", "uploads"));
  },
  filename: function (req, file, cb) {
    const safeName = file.originalname.replace(/\s+/g, "-");
    cb(null, Date.now() + "-" + safeName);
  },
});

const upload = multer({ storage });

module.exports = {
  upload,
  uploadSingle: (fieldName) => upload.single(fieldName),
  uploadArray: (fieldName, max) => upload.array(fieldName, max),
};
