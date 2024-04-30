const Product = require("../../models/product.model");
const Category = require("../../models/category.model");
const createTreeHelper = require("../../helpers/createTree.helper");
module.exports.index = async (req, res) => {
  //San pham noi bat
  const productsFeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active",
  }).sort({position:"desc"}).limit(5);
  const newProductsFeatured = productsFeatured.map((product) => {
    product.priceNew = (
      (product.price * (100 - product.discountPercentage)) /
      100
    ).toFixed(2);
    return product;
  });
  const productsNew = await Product.find({
    deleted: false,
    status: "active",
  }).sort({position:"desc"}).limit(5);
  const newProductsNew= productsNew.map((product) => {
    product.priceNew = (
      (product.price * (100 - product.discountPercentage)) /
      100
    ).toFixed(2);
    return product;
  });
  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    productsFeatured: productsFeatured,
    productsNew: newProductsNew,
  });
};
