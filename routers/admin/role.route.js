const express = require("express");
const router = express.Router();
const roleController = require("../../controllers/admin/role.controller");
router.get("/", roleController.index);
router.get("/create", roleController.create);
router.post("/create", roleController.postCreate);
router.get("/edit/:id", roleController.edit);
router.patch("/edit/:id", roleController.editPatch);
router.delete("/delete/:id", roleController.delete);
router.get("/detail/:id", roleController.detail);
router.get("/permissions", roleController.permissions);
router.patch(
  "/permissions",
  roleController.permissionsPatch
);
module.exports = router;
