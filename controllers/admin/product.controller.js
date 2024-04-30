const Product = require("../../models/product.model");
const Category = require("../../models/category.model");
const filterStatusHelper = require("../../helpers/filterStatus.helper");
const searchProductsHelper = require("../../helpers/searchProducts.helper");
const paginationHelper = require("../../helpers/paginate.helper");
const systemConfig = require("../../configs/system");
const createTreeHelper = require("../../helpers/createTree.helper");
const Account = require("../../models/account.model");
// [GET] /admin/products
module.exports.index = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if (permissions && permissions.includes("products-view")) {
    let find = {
      deleted: false,
    };
    const totalRow = await Product.countDocuments(find);
    let filterStatus = filterStatusHelper.filterStatus(req.query, find); // filter status
    let keyword = searchProductsHelper.searchProducts(req.query, find); // for search input
    let objectPagination = {
      limit: 5,
      page: 1,
      totalRow: totalRow,
      skip: 0,
      totalPage: Math.ceil(totalRow / 5),
    };
    let pagination = paginationHelper.paginate(req.query, objectPagination);

    //Sort
    let sort = { position: "desc" };
    if (req.query.sortKey && req.query.sortValue) {
      sort = {};
      sort[req.query.sortKey] = req.query.sortValue;
    }
    // Get products
    const products = await Product.find(find)
      .limit(pagination.limit)
      .skip(pagination.skip)
      .sort(sort);
    for (const product of products) {
      let user = await Account.findOne({ _id: product.createdBy.account_id });
      if (user) {
        product.name = user.fullName;
      }
      //Nguoi cap nhat gan nhat
      if (product.updatedBy.length > 0) {
        user = await Account.findOne({
          _id: product.updatedBy[product.updatedBy.length - 1].account_id,
        });
        if (user) {
          product.updatedName = user.fullName;
          product.updatedTime =
            product.updatedBy[product.updatedBy.length - 1].updatedAt;
        }
      }
    }
    res.render("admin/pages/products/index", {
      pageTitle: "Danh sách sản phẩm",
      products: products,
      filterStatus: filterStatus,
      keyword: keyword,
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.totalPage,
      sort: sort,
    });
  } else {
    res.status(403).json({ message: "Bạn không có quyền truy cập" });
  }
};
// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const permissions = res.locals.role.permissions;
    if (permissions && permissions.includes("products-edit")) {
      const { status, id } = req.params;
      if (status !== "active" && status !== "inactive") {
        return res.redirect("back");
      }
      const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: Date.now(),
      };
      await Product.updateOne(
        { _id: id },
        { status: status, $push: { updatedBy: updatedBy } }
      );
      req.flash("success", "Đổi trạng thái thành công!");
      res.redirect("back");
    } else {
      res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }
  } catch (e) {
    req.flash("error", "Đổi trạng thái thất bại!");
    res.redirect("back");
  }
};
// [PATCH] /admin/products/change-status-multi
module.exports.changeStatusMulti = async (req, res) => {
  try {
    const type = req.body.type;
    const ids = req.body.ids.split(",");
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: Date.now(),
    };
    const permissions = res.locals.role.permissions;

    switch (type) {
      case "active":
        if (permissions && permissions.includes("products-edit")) {
          await Product.updateMany(
            { _id: { $in: ids } },
            { status: "active", $push: { updatedBy: updatedBy } }
          );
          req.flash("success", "Đổi trạng thái thành công!");
        } else {
          res.status(403).json({ message: "Bạn không có quyền truy cập" });
        }
        break;
      case "inactive":
        if (permissions && permissions.includes("products-edit")) {
          await Product.updateMany(
            { _id: { $in: ids } },
            { status: "inactive", $push: { updatedBy: updatedBy } }
          );
          req.flash("success", "Đổi trạng thái thành công!");
        } else {
          res.status(403).json({ message: "Bạn không có quyền truy cập" });
        }
        break;
      case "delete":
        if (permissions && permissions.includes("products-delete")) {
          await Product.updateMany(
            { _id: { $in: ids } },
            {
              deleted: true,
              deletedBy: {
                account_id: res.locals.user.id,
                deletedAt: Date.now(),
              },
            }
          );
          req.flash("success", "Xóa thành công!");
        } else {
          res.status(403).json({ message: "Bạn không có quyền truy cập" });
        }
        break;
      case "change-position":
        if (permissions && permissions.includes("products-edit")) {
          for (const item of ids) {
            const [id, position] = item.split("-");
            await Product.updateOne(
              { _id: id },
              { position: position, $push: { updatedBy: updatedBy } }
            );
            req.flash("success", "Đổi vị trí thành công!");
          }
        } else {
          res.status(403).json({ message: "Bạn không có quyền truy cập" });
        }
        break;
      default:
        break;
    }
    res.redirect("back");
  } catch (err) {
    req.flash("error", "Thao tác thất bại! Vui lòng thử lại sau");
    res.redirect("back");
  }
};

// [PATCH] /admin/products/delete/:id
module.exports.delete = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if (permissions && permissions.includes("products-delete")) {
    const { id } = req.params;
    await Product.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedBy: { account_id: res.locals.user.id, deletedAt: Date.now() },
      }
    );
    req.flash("success", "Xóa thành công!");
    res.redirect("back");
  } else {
    res.status(403).json({ message: "Bạn không có quyền truy cập" });
  }
};
// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if (permissions && permissions.includes("products-create")) {
    const categories = await Category.find({ deleted: false });

    const treeCategories = createTreeHelper.create(categories);

    res.render("admin/pages/products/create", {
      pageTitle: "Tạo sản phẩm",
      categories: treeCategories,
    });
  } else {
    res.status(403).json({ message: "Bạn không có quyền truy cập" });
  }
};
// [POST] /admin/products/create
module.exports.postCreate = async (req, res) => {
  const permissions = res.locals.role.permissions;

  if (permissions && permissions.includes("products-create")) {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if (req.body.position === "") {
      const totalRow = await Product.countDocuments({ deleted: false });
      req.body.position = totalRow + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }
    if (!req.body.thumbnail) {
      req.body.thumbnail = "/images/default-product-image.png";
    }
    req.body.createdBy = {
      account_id: res.locals.user.id,
      createdAt: Date.now(),
    };

    const product = new Product(req.body);
    await product.save();
    req.flash("success", "Tạo sản phẩm thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  } else {
    res.status(403).json({ message: "Bạn không có quyền truy cập" });
  }
};
// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const permissions = res.locals.role.permissions;
    if (permissions && permissions.includes("products-edit")) {
      const categories = await Category.find({ deleted: false });
      const treeCategories = createTreeHelper.create(categories);
      const { id } = req.params;
      let find = {
        deleted: false,
        _id: id,
      };
      const product = await Product.findOne(find);
      res.render("admin/pages/products/edit", {
        pageTitle: "Chỉnh sửa sản phẩm",
        product: product,
        categories: treeCategories,
      });
    } else {
      res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }
  } catch (e) {
    req.flash("error", "Không tìm thấy sản phẩm");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};
// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const permissions = res.locals.role.permissions;
    if (permissions && permissions.includes("products-edit")) {
      const { id } = req.params;
      req.body.price = parseInt(req.body.price);
      req.body.discountPercentage = parseInt(req.body.discountPercentage);
      req.body.stock = parseInt(req.body.stock);
      req.body.position = parseInt(req.body.position);
      const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: Date.now(),
      };

      const product = await Product.updateOne(
        { _id: id },
        {
          ...req.body,
          $push: { updatedBy: updatedBy },
        }
      );
      req.flash("success", "Chỉnh sửa sản phẩm thành công!");
      res.redirect(`back`);
    } else {
      res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }
  } catch (e) {
    req.flash("error", "Chỉnh sửa sản phẩm thất bại!");
    res.send("404");
  }
};
// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const permissions = res.locals.role.permissions;
    if (permissions && permissions.includes("products-view")) {
      const { id } = req.params;
      const product = await Product.findOne({ _id: id, deleted: false });
      const category = await Category.findOne({
        _id: product.product_category_id,
      });
      product.categoryName = category.title;
      res.render("admin/pages/products/detail", {
        pageTitle: product.title,
        product: product,
      });
    } else {
      res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }
  } catch (e) {
    req.flash("error", "Không tìm thấy sản phẩm");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};
