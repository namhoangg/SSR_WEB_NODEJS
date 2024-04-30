const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const uploadToCloundinary = require("../../helpers/uploadToCloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_KEY_SEC,
});
// const storageMulter = require("../../helpers/storageMulter");
module.exports.upload = async (req, res, next) => {
  try {
    if (req.file) {
      const link = await uploadToCloundinary.uploadToCloundinary(
        req.file.buffer
      );

      req.body[req.file.fieldname] = link;
    }
    next();
  } catch (error) {
    res.send(error.message);
  }
};
