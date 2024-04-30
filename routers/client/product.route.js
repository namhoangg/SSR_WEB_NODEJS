const express = require("express");
const router = express.Router();
const productController = require("../../controllers/client/product.controller");
router.get("/", productController.index);
router.get("/:slugCategory", productController.getByCategory);
router.get("/detail/:slugProduct", productController.detail);
module.exports = router;
