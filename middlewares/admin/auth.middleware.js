const systemConfig = require("../../configs/system");
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
module.exports.requireAuth = async (req, res, next) => {
  try {
    const tokenAdmin = req.cookies.tokenAdmin;
    if (!tokenAdmin) {
      return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }
    const user = await Account.findOne({
      token: tokenAdmin,
      deleted: false,
    }).select("-password");
    if (!user) {
      req.flash("error", "Tài khoản không tồn tại");
      return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }
    if (user.status === "inactive") {
      req.flash("error", "Tài khoản đã bị khóa!");
      res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
      return;
    }
    const role = await Role.findOne({ _id: user.role_id }).select("title permissions");
    res.locals.user = user;
    res.locals.role = role;
    next();
  } catch (error) {
    req.flash("error", "Có lỗi xảy ra, vui lòng thử lại sau");
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  }
};
