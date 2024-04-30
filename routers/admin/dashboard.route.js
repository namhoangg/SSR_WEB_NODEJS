const express = require("express");
const router = express.Router();
const dashboardController = require("../../controllers/admin/dashboard.controller");
// [GET] /admin/dashboard
router.get("/", dashboardController.dashboard);
module.exports = router;
