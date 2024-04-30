const Account = require("../../models/account.model");
const bcrypt = require("bcrypt");
module.exports.index = async (req, res) => {
  res.render("admin/pages/my-account/index", {
    pageTitle: "Tài khoản của tôi",
  });
};
module.exports.edit = async (req, res) => {
  res.render("admin/pages/my-account/edit", {
    pageTitle: "Chỉnh sửa tài khoản",
  });
};
module.exports.editPatch = async (req, res) => {
  if (!req.body.fullName || !req.body.email) {
    req.flash("error", "Vui lòng nhập đầy đủ thông tin");
    return res.redirect("back");
  }
  if (req.body.password && req.body.password.length < 6) {
    req.flash("error", "Mật khẩu phải có ít nhất 6 ký tự");
    return res.redirect("back");
  }
  const account = await Account.findOne({
    email: req.body.email,
    _id: { $ne: res.locals.user.id },
    deleted: false,
    status: { $ne: "inactive" },
  });
  if (account) {
    req.flash("error", "Email đã tồn tại");
    return res.redirect("back");
  }
  if (req.body.password) {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
  } else {
    delete req.body.password;
  }
  console.log(req.body);
  await Account.updateOne({ _id: res.locals.user.id }, req.body);
  req.flash("success", "Chỉnh sửa tài khoản thành công!");
  res.redirect("back");
};
