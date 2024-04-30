module.exports.validate = async (req, res, next) => {
  try {
    let hasError = false;
    let errors = {};
    if (!req.body.email) {
      errors.email = "Vui lòng nhập email";
      hasError = true;
    }
    if (!req.body.password) {
      errors.password = "Vui lòng nhập mật khẩu";
      hasError = true;
    }
    if (req.body.password && req.body.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      hasError = true;
    }
    if (hasError) {
      req.flash("error", "Vui lòng nhập đầy đủ thông tin");
      req.session.errors = errors;
      return res.redirect("back");
    }
    next();
  } catch (e) {
    req.flash("error", "Đăng nhập thất bại");
    res.redirect("back");
  }
};
