const express = require("express");
const router = express.Router();
const accountController = require("../../controllers/admin/account.controller");
const validate = require("../../validates/adminAccount.validate");
const multer = require("multer");
const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares");
router.get("/", accountController.index);
router.get("/create", accountController.create);
router.post(
  "/create",
  upload.single("avatar"),
  uploadCloud.upload,
  validate.validate,
  accountController.createPost
);
router.patch("/change-status/:status/:id", accountController.changeStatus);
router.get("/detail/:id", accountController.detail);
router.get("/edit/:id", accountController.edit);
router.patch(
  "/edit/:id",
  upload.single("avatar"),
  uploadCloud.upload,
  validate.validate,
  accountController.editPatch
);
router.delete("/delete/:id", accountController.delete);
module.exports = router;
