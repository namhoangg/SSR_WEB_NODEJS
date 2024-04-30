//Express
const express = require("express");
const router = express.Router();

//Multer and Cloudinary for image upload
const multer = require("multer");
const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares");
//Controller
const productController = require("../../controllers/admin/product.controller");

//Validate
const validate = require("../../validates/createProduct.validate");

//Routes
router.get("/", productController.index);

router.patch("/change-status/:status/:id", productController.changeStatus);

router.patch("/change-status-multi", productController.changeStatusMulti);

router.delete("/delete/:id", productController.delete);

router.get("/create", productController.create);

router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.create,
  productController.postCreate
);

router.get("/edit/:id", productController.edit);

router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.create,
  productController.editPatch
);
router.get("/detail/:id", productController.detail);
module.exports = router;
