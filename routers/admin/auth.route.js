const express = require("express");
const router = express.Router();
const authController = require("../../controllers/admin/auth.controller");
const authValidate = require("../../validates/adminAuth.validate");
router.get("/login", authController.login);
router.post("/login", authValidate.validate, authController.postLogin);
router.get("/logout", authController.postLogout);
module.exports = router;
