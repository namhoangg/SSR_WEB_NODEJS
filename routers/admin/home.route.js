const express = require("express");
const homeController = require("../../controllers/admin/home.controller");
const router = express.Router();
router.get("/", homeController.index);
module.exports=router;