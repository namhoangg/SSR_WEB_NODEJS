const Category = require("../../models/category.model");
const createTreeHelper = require("../../helpers/createTree.helper");
module.exports.category = async (req, res, next) => {
  let find = {
    deleted: false,
  };
  const categories = await Category.find(find);
  const newCategories= createTreeHelper.create(categories);
  res.locals.categories = newCategories;
  next();
};
