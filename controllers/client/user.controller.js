const User = require("../../models/user.model");
const bcryt = require("bcrypt");
const generate = require("../../helpers/generateToken");
const ForgotPassword = require("../../models/forgot-password.model");
const sendMailHelper = require("../../helpers/sendMail");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
const Cart = require("../../models/cart.model");
module.exports.register = (req, res) => {
  res.render("client/pages/user/register", {
    title: "register",
  });
};
module.exports.registerPost = async (req, res) => {
  const existEmail = await User.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (existEmail) {
    req.flash("error", `Email đã tồn tại!`);
    res.redirect("back");
    return;
  }
  req.body.password = bcryt.hashSync(req.body.password, 10);
  const user = new User(req.body);
  await user.save();
  res.cookie("tokenUser", user.tokenUser);
  await Cart.updateOne({ _id: req.cookies.cartId }, { user_id: user.id });
  res.redirect("/");
};
module.exports.login = (req, res) => {
  res.render("client/pages/user/login", {
    title: "Đăng nhập",
  });
};
module.exports.loginPost = async (req, res) => {
  const user = await User.findOne(
    { email: req.body.email },
    { deleted: false }
  );
  if (!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect("back");
    return;
  }
  const checkPassword = bcryt.compareSync(req.body.password, user.password);
  if (!checkPassword) {
    req.flash("error", "Mật khẩu không đúng!");
    res.redirect("back");
    return;
  }
  if (user.status === "inactive") {
    req.flash("error", `Tài khoản của bạn đã bị khóa!`);
    res.redirect("back");
    return;
  }
  res.cookie("tokenUser", user.tokenUser);
  const existCart = await Cart.findOne({ user_id: user.id });
  if (existCart) {
    res.cookie("cartId", existCart.id);
  } else {
    await Cart.updateOne(
      {
        _id: req.cookies.cartId,
      },
      {
        user_id: user.id,
      }
    );
  }
  req.flash("success", `Đăng nhập thành công!`);
  res.redirect("/");
};
module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser");
  res.clearCookie("cartId");
  req.flash("success", `Đăng xuất thành công!`);
  res.redirect("/");
};
module.exports.forgotPassword = (req, res) => {
  res.render("client/pages/user/forgot-password", {
    title: "Quên mật khẩu",
  });
};
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email: email, deleted: false });
  if (!user) {
    req.flash("error", `Email không tồn tại!`);
    res.redirect("back");
    return;
  }
  const checkForgotPassword = await ForgotPassword.findOne({ email: email });
  if (checkForgotPassword) {
    req.flash("error", "Vui lòng gửi lại sau 3 phút!");
    res.redirect("back");
    return;
  }
  //neu ton tai gui otp qua email
  const objectForgotPassword = {
    email: email,
    otp: generate.generateOTP(8),
    expireAt: Date.now()+180000,
  };
  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();
  const subject = "Nodejs App OTP - Quên mật khẩu";
  const html = `<h3>OTP để reset mật khẩu của bạn là: ${objectForgotPassword.otp}</h3>`;
  await sendMailHelper.sendMail(email, subject, html);
  res.redirect(`/user/password/otp?email=${email}`);
};
module.exports.otp = async (req, res) => {
  const email = req.query.email;
  res.render("client/pages/user/otp", {
    title: "OTP",
    email: email,
  });
};
module.exports.otpPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;
  const checkUser = await ForgotPassword.findOne({ email: email, otp: otp });
  if (checkUser) {
    const user = await User.findOne({ email: email });
    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/user/password/reset");
  } else {
    req.flash("error", `OTP không đúng!`);
    res.redirect("back");
    return;
  }
};
module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user/reset-password", {
    title: "Đặt lại mật khẩu",
  });
};
module.exports.resetPasswordPost = async (req, res) => {
  const tokenUser = req.cookies.tokenUser;
  const password = req.body.password;
  const user = await User.updateOne(
    {
      tokenUser: tokenUser,
    },
    {
      password: bcryt.hashSync(password, 10),
    }
  );
  if (user) {
    req.flash("success", `Đổi mật khẩu thành công!`);
    res.clearCookie("tokenUser");
    res.redirect("/");
  }
};
//[GET] /user/info chua them authen
module.exports.info = async (req, res) => {
  const carts = await Cart.find({
    user_id: res.locals.user.id,
  });
  cart_id = [];
  for (const cart of carts) {
    cart_id.push(cart.id);
  }
  const orders = await Order.find({
    cart_id: { $in: cart_id },
  });
  for (const order of orders) {
    if (order.products.length > 0) {
      for (const item of order.products) {
        const productId = item.product_id;
        const productInfo = await Product.findOne({
          _id: productId,
        }).select("title thumbnail slug price discountPercentage");
        productInfo.priceNew = (
          (productInfo.price * (100 - productInfo.discountPercentage)) /
          100
        ).toFixed(0);
        productInfo.totalPrice = item.quantity * productInfo.priceNew;
        item.productInfo = productInfo;
        item.totalPrice = productInfo.totalPrice;
      }
    }
    order.totalPrice = order.products.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );
  }
  res.render("client/pages/user/info", {
    title: "Thông tin cá nhân",
    orders: orders,
  });
};
