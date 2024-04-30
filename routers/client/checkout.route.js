const express = require("express");
const controller = require("../../controllers/client/checkout.controller");
const router = express.Router();
router.get("/", controller.index);
router.post("/order", controller.order);
router.get("/success/:id", controller.success);
module.exports = router;
