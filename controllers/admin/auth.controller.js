const Account = require("../../models/account.model");
const bcrypt = require("bcrypt");
const systemConfig = require("../../configs/system");
// [GET] /admin/login
module.exports.login = async (req, res) => {
  if (req.cookies.tokenAdmin) {
    const user = await Account.findOne({
      token: req.cookies.tokenAdmin,
      deleted: false,
      status: { $ne: "inactive" },
    });
    if (user) {
      return res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
  }
  res.render("admin/pages/auth/login", {
    errors: req.session.errors,
  });
};
// [POST] /admin/login
module.exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Account.findOne({ email: email, deleted: false });
    if (!user) {
      req.flash("error", "Email không tồn tại");
      return res.redirect("back");
    }
    if (!bcrypt.compareSync(password, user.password)) {
      req.flash("error", "Mật khẩu không đúng");
      return res.redirect("back");
    }
    if (user.status === "inactive") {
      req.flash("error", "Tài khoản đã bị khóa!");
      return res.redirect("back");
    }
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const halfday = day / 2;
    res.cookie("tokenAdmin", user.token, {
      expires: new Date(Date.now() + halfday),
    });
    // 24 * 60 * 60 * 1000
    req.flash("success", "Đăng nhập thành công");
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
  } catch (e) {
    req.flash("error", "Đăng nhập thất bại");
    res.redirect("back");
  }
};
// [GET] /admin/logout
module.exports.postLogout = (req, res) => {
  res.clearCookie("tokenAdmin");
  req.flash("success", "Đăng xuất thành công");
  res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
};
