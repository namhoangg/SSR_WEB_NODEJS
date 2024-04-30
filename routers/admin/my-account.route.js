const express = require("express");
const router = express.Router();
const myAccountController = require("../../controllers/admin/my-account.controller");
const multer = require("multer");
const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares");
router.get("/", myAccountController.index);
router.get("/edit", myAccountController.edit);
router.patch(
  "/edit",
  upload.single("avatar"),
  uploadCloud.upload,
  myAccountController.editPatch
);
module.exports = router;
