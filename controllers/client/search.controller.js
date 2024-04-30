const Product = require("../../models/product.model");
const Category = require("../../models/category.model");
//[GET] /search
module.exports.index = async (req, res) => {
  const keyword = req.query.keyword;
  let newProducts = [];
  if (keyword) {
    const regex = new RegExp(keyword, "i"); // i khong phan biet hoa thuong
    const products = await Product.find({
      deleted: false,
      status: "active",
      title: regex,
    });
    newProducts = products.map((product) => {
      product.priceNew = (
        (product.price * (100 - product.discountPercentage)) /
        100
      ).toFixed(2);
      return product;
    });
  }
  res.render("client/pages/search/index", {
    title: "Search",
    keyword: keyword,
    products: newProducts,
  });
};
