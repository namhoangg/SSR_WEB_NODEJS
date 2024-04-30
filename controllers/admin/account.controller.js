const Role = require("../../models/role.model");
const Account = require("../../models/account.model");
const bcrypt = require("bcrypt");
// [GET] /admin/accounts
module.exports.index = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if (permissions && permissions.includes("accounts-view")) {
    const records = await Account.find({ deleted: false }).select(
      "-password -token"
    );
    for (const record of records) {
      record.role = await Role.findOne({ _id: record.role_id });
    }
    res.render("admin/pages/accounts/index", {
      pageTitle: "Tài khoản",
      records: records,
    });
  } else {
    res.status(403).json({ message: "Bạn không có quyền truy cập" });
  }
};
// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if (permissions && permissions.includes("accounts-create")) {
    const roles = await Role.find({ deleted: false });
    res.render("admin/pages/accounts/create", {
      pageTitle: "Tạo tài khoản",
      roles: roles,
      errors: req.session.errors,
    });
  } else {
    res.status(403).json({ message: "Bạn không có quyền truy cập" });
  }
};
//[POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  try {
    const permissions = res.locals.role.permissions;
    if (permissions && permissions.includes("accounts-create")) {
      const emailExist = await Account.findOne({
        email: req.body.email,
        deleted: false,
      });
      if (emailExist) {
        req.flash("error", "Email đã tồn tại");
        return res.redirect("back");
      }
      req.body.password = bcrypt.hashSync(req.body.password, 10);
      if (!req.body.avatar) {
        req.body.avatar = "/images/default_avatar.png";
      }
      const account = new Account(req.body);
      await account.save();
      req.flash("success", "Tạo tài khoản thành công");
      res.redirect("back");
    } else {
      res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }
  } catch (error) {
    req.flash("error", "Tạo tài khoản thất bại");
    res.redirect("back");
  }
};
//[PATCH] /admin/accounts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const permissions = res.locals.role.permissions;
    if (permissiosn && permissions.includes("accounts-edit")) {
      const { status, id } = req.params;
      await Account.updateOne({ _id: id }, { status: status });
      req.flash("success", "Thay đổi trạng thái thành công");
      res.redirect("back");
    } else {
      res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }
  } catch (error) {
    req.flash("error", "Thay đổi trạng thái thất bại");
    res.redirect("back");
  }
};
//[GET] /admin/accounts/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const permissions = res.locals.role.permissions;
    if (permissions && permissions.includes("accounts-view")) {
      const { id } = req.params;
      const record = await Account.findOne({ _id: id });
      record.role = await Role.findOne({ _id: record.role_id });

      res.render("admin/pages/accounts/detail", {
        pageTitle: record.fullName,
        record: record,
      });
    } else {
      res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }
  } catch (error) {
    req.flash("error", "Lấy thông tin tài khoản thất bại");
    res.redirect("back");
  }
};
//[GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const permissions = res.locals.role.permissions;
    if (permissions && permissions.includes("accounts-edit")) {
      const record = await Account.findOne({ _id: req.params.id });
      record.role = await Role.findOne({ _id: record.role_id });
      const roles = await Role.find({ deleted: false });
      res.render("admin/pages/accounts/edit", {
        pageTitle: "Chỉnh sửa tài khoản",
        record: record,
        roles: roles,
      });
    } else {
      res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }
  } catch (error) {
    req.flash("error", "Lấy thông tin tài khoản thất bại");
    res.redirect("back");
  }
};
//[PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const permissions = res.locals.role.permissions;
    if (permissions && permissions.includes("accounts-edit")) {
      const { id } = req.params;
      const record = await Account.findOne({ _id: id });
      if (req.body.password != record.password) {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
      }
      if (!req.body.avatar) {
        req.body.avatar = record.avatar;
      }
      const isExist = await Account.findOne({
        email: req.body.email,
        _id: { $ne: id },
      });

      if (isExist) {
        req.flash("error", "Email đã tồn tại");
        return res.redirect("back");
      }
      await Account.updateOne({ _id: id, deleted: false }, req.body);
      req.flash("success", "Chỉnh sửa tài khoản thành công");
      res.redirect("back");
    } else {
      res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }
  } catch (e) {
    req.flash("error", "Chỉnh sửa tài khoản thất bại");
    res.redirect("back");
  }
};
//[DELETE] /admin/accounts/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const permissions = res.locals.role.permissions;
    if (permissions && permissions.includes("accounts-delete")) {
      const { id } = req.params;
      await Account.updateOne({ _id: id }, { deleted: true });
      req.flash("success", "Xóa tài khoản thành công");
      res.redirect("back");
    } else {
      res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }
  } catch (error) {
    req.flash("error", "Xóa tài khoản thất bại");
    res.redirect("back");
  }
};
