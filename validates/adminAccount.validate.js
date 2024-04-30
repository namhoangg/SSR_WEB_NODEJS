module.exports.validate = async (req, res, next) => {
  try {
    console.log(req.body);
    let hasError = false;
    let errors = {};
    if (!req.body.fullName) {
      errors.fullName = "Vui lòng nhập họ và tên";
      hasError = true;
    }
    if (!req.body.email) {
      errors.email = "Vui lòng nhập email";
      hasError = true;
    }
    if (!req.body.password) {
      errors.password = "Vui lòng nhập mật khẩu";
      hasError = true;
    }
    if(req.body.password&&req.body.password.length<6){
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      hasError = true;
    };
    if (!req.body.role_id) {
      errors.role_id = "Vui lòng chọn quyền";
      hasError = true;
    }
    if (!req.body.phone) {
      errors.phone = "Vui lòng nhập số điện thoại";
      hasError = true;
    }
    if (hasError) {
      console.log(errors);
      req.flash("error", "Vui lòng nhập đầy đủ thông tin");
      req.session.errors = errors;
      return res.redirect("back");
    }
    next();
  } catch (error) {
    req.flash("error", "Tạo tài khoản thất bại");
    res.redirect("back");
  }
};
