const Category = require("../../models/category.model");
const Product = require("../../models/product.model");
const Account = require("../../models/account.model");
const User = require("../../models/user.model");

module.exports.dashboard = async (req, res) => {
  const stats = {
    category: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    product: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    account: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    user: {
      total: 0,
      active: 0,
      inactive: 0,
    },
  };
  const category = await Category.find({ deleted: false });
  stats.category.total = category.length;
  stats.category.active = category.filter(
    (item) => item.status === "active"
  ).length;
  stats.category.inactive = category.filter(
    (item) => item.status === "inactive"
  ).length;
  const product = await Product.find({ deleted: false });
  stats.product.total = product.length;
  stats.product.active = product.filter(
    (item) => item.status === "active"
  ).length;
  stats.product.inactive = product.filter(
    (item) => item.status === "inactive"
  ).length;
  const account = await Account.find({ deleted: false });
  stats.account.total = account.length;
  stats.account.active = account.filter(
    (item) => item.status === "active"
  ).length;
  stats.account.inactive = account.filter(
    (item) => item.status === "inactive"
  ).length;
  const user = await User.find({ deleted: false });
  stats.user.total = user.length;
  stats.user.active = user.filter((item) => item.status === "active").length;
  stats.user.inactive = user.filter(
    (item) => item.status === "inactive"
  ).length;
  res.render("admin/pages/dashboard/index", {
    pageTitle: "Trang tổng quan",
    stats: stats,
  });
};
