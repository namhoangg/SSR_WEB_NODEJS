const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
let streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
    try {
      streamifier.createReadStream(buffer).pipe(stream);
    } catch (err) {}
  });
};
const uploadToCloundinary = async (buffer) => {
  let result = await streamUpload(buffer);
  return result.secure_url;
};
module.exports.uploadToCloundinary = uploadToCloundinary;
