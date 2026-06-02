const { deleteUploadFile } = require("../utils/fileHelper");

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
  });
  if (error) {
    // If files were uploaded before validation ran, clean them up
    if (req.file) {
      deleteUploadFile(req.file.path || req.file.filename);
    }
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file) => deleteUploadFile(file.path || file.filename));
    }
    return res.status(400).json({
      message: "Validation failed",
      details: error.details.map((detail) => detail.message),
    });
  }
  next();
};

module.exports = validate;
