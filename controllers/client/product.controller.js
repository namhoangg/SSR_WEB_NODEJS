const Product = require("../../models/product.model");
const Category = require("../../models/category.model");
const getSubCategories = require("../../helpers/getByCategory.helper");
//[GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({ deleted: false, status: "active" })
    .sort({ position: "desc" })
    .limit(5);
  const newProducts = products.map((product) => {
    product.priceNew = (
      (product.price * (100 - product.discountPercentage)) /
      100
    ).toFixed(0);
    return product;
  });
  res.render("client/pages/products/index", {
    pageTitle: "Sản phẩm",
    products: newProducts,
  });
};
//[GET] /products/:slugCategory
module.exports.getByCategory = async (req, res) => {
  try {
    const slugCategory = req.params.slugCategory;
    const category = await Category.findOne({
      slug: slugCategory,
      deleted: false,
      status: "active",
    });
    if (!category) {
      return res.redirect("/");
    }
    const subCategories = await getSubCategories.getCategory(category.id);
    const listIdCategory = subCategories.map((subCategory) => subCategory.id);
    const products = await Product.find({
      product_category_id: { $in: [category.id, ...listIdCategory] },
      deleted: false,
      status: "active",
    }).sort({ position: "desc" });
    res.render("client/pages/products/index", {
      pageTitle: category.name,
      products: products,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};
//[GET] /products/detail/:slugProduct
module.exports.detail = async (req, res) => {
  try {
    const slugProduct = req.params.slugProduct;
    const product =
      (await Product.findOne({
        slug: slugProduct,
        deleted: false,
        status: "active",
      })) || {};
    console.log(product);
    const category = await Category.findOne({
      _id: product.product_category_id,
      deleted: false,
    });
    product.category = category;
    product.priceNew = (
      (product.price * (100 - product.discountPercentage)) /
      100
    ).toFixed(0);
    if (!product.id) {
      return res.redirect("/");
    }
    res.render("client/pages/products/detail", {
      pageTitle: product.name,
      product: product,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};
