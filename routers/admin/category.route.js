//Express
const express = require("express");
const router = express.Router();
//Controller
const categoryController = require("../../controllers/admin/category.controller");
//Multer and Cloudinary for image upload
const multer = require("multer");
const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares");
//Validate
const validate = require("../../validates/createCategory.validate");
router.get("/", categoryController.index);
router.get("/create", categoryController.create);
router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.create,
  categoryController.postCreate
);
router.get("/edit/:id", categoryController.edit);
router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.create,
  categoryController.editPatch
);
router.delete("/delete/:id", categoryController.delete);
router.patch("/change-multi", categoryController.changeMulti);
router.get("/detail/:id", categoryController.detail);
router.patch("/change-status/:status/:id", categoryController.changeStatus);
module.exports = router;
