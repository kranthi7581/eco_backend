const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "..", "public", "uploads");

function ensureUploadDir() {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
}

function deleteUploadFile(filePath) {
  if (!filePath) return;
  const filename = filePath.split("/").pop();
  const fullPath = path.join(uploadDir, filename);
  try {
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  } catch (err) {
    // swallow error; controllers will handle response
    console.error("deleteUploadFile error:", err.message);
  }
}

const getImageUrl = (filename) => {
  if (!filename) return null;

  return `http://localhost:5000/uploads/${filename}`;
};

module.exports = { ensureUploadDir, deleteUploadFile, getImageUrl };
