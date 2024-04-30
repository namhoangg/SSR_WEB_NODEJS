const Category = require("../../models/category.model");
const createTreeHelper = require("../../helpers/createTree.helper");
const filterHelper = require("../../helpers/filterStatus.helper");
const seachHelper = require("../../helpers/searchProducts.helper");
// [GET] /admin/category
module.exports.index = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if (permissions && permissions.includes("products-category_view")) {
    let find = {
      deleted: false,
    };
    const filterStatus = filterHelper.filterStatus(req.query, find);
    const keyword = seachHelper.searchProducts(req.query, find);
    const records = await Category.find(find);
    const categories = createTreeHelper.create(records);
    res.render("admin/pages/category/index", {
      pageTitle: "Danh mục sản phẩm",
      categories: categories,
      filterStatus: filterStatus,
      keyword: keyword,
    });
  } else {
    res.status(403).json({ message: "Bạn không có quyền truy cập" });
  }
};
// [GET] /admin/category/create
module.exports.create = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if (permissions && permissions.includes("products-category_create")) {
    const records = await Category.find({ deleted: false });
    const recordsTree = createTreeHelper.create(records);
    res.render("admin/pages/category/create", {
      pageTitle: "Tạo danh mục",
      records: recordsTree,
    });
  } else {
    res.status(403).json({ message: "Bạn không có quyền truy cập" });
  }
};
// [POST] /admin/category/create
module.exports.postCreate = async (req, res) => {
  try {
    const permissions = res.locals.role.permissions;
    if (permissions && permissions.includes("products-category_create")) {
      if (!req.body.thumbnail) {
        req.body.thumbnail = "/images/default-product-image.png";
      }
      if (req.body.position) {
        req.body.position = parseInt(req.body.position);
      } else {
        req.body.position =
          (await Category.countDocuments({ deleted: false })) + 1;
      }
      const category = new Category(req.body);
      await category.save();
      req.flash("success", "Tạo danh mục thành công!");
      res.redirect("/admin/category/create");
    } else {
      res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }
  } catch (e) {
    console.log(e);
    req.flash("error", "Tạo danh mục thất bại!");
    res.redirect("/admin/category/create");
  }
};
// [GET] /admin/category/edit/:id
module.exports.edit = async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  console.log(category);
  const records = await Category.find({ deleted: false });
  const recordsTree = createTreeHelper.create(records);
  res.render("admin/pages/category/edit", {
    pageTitle: "Chỉnh sửa danh mục",
    record: category,
    categories: recordsTree,
  });
};
// [PATCH] /admin/category/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const permissions = res.locals.role.permissions;
    if (permissions && permissions.includes("products-category_edit")) {
      const { id } = req.params;
      if (req.body.position) {
        req.body.position = parseInt(req.body.position);
      }
      await Category.updateOne({ _id: id }, req.body);
      req.flash("success", "Chỉnh sửa danh mục thành công!");
      res.redirect("back");
    } else {
      res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }
  } catch (e) {
    req.flash("error", "Chỉnh sửa danh mục thất bại!");
    res.redirect("back");
  }
};
// [DELETE] /admin/category/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const permissions = res.locals.role.permissions;
    if (permissions && permissions.includes("products-category_delete")) {
      const { id } = req.params;
      await Category.updateOne({ _id: id }, { deleted: true });
      req.flash("success", "Xóa danh mục thành công!");
      res.redirect("back");
    } else {
      res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }
  } catch (e) {
    req.flash("error", "Xóa danh mục thất bại!");
    res.redirect("back");
  }
};

// [PATCH] /admin/category/change-multi
module.exports.changeMulti = async (req, res) => {
  try {
    const type = req.body.type;
    const ids = req.body.ids.split(",");
    const permissions = res.locals.role.permissions;
    switch (type) {
      case "active":
        if (permissions && permissions.includes("products-category_edit")) {
          await Category.updateMany(
            { _id: { $in: ids } },
            { status: "active" }
          );
          req.flash("success", "Đổi trạng thái thành công!");
        } else {
          res.status(403).json({ message: "Bạn không có quyền truy cập" });
        }
        break;
      case "inactive":
        if (permissions && permissions.includes("products-category_edit")) {
          await Category.updateMany(
            { _id: { $in: ids } },
            { status: "inactive" }
          );
          req.flash("success", "Đổi trạng thái thành công!");
        } else {
          res.status(403).json({ message: "Bạn không có quyền truy cập" });
        }
        break;
      case "delete":
        if (permissions && permissions.includes("products-category_delete")) {
          await Category.updateMany({ _id: { $in: ids } }, { deleted: true });
          req.flash("success", "Xóa thành công!");
        } else {
          res.status(403).json({ message: "Bạn không có quyền truy cập" });
        }
        break;
      case "change-position":
        if (permissions && permissions.includes("products-category_edit")) {
          for (const item of ids) {
            const [id, position] = item.split("-");
            await Category.updateOne({ _id: id }, { position: position });
          }
          req.flash("success", "Đổi vị trí thành công!");
        } else {
          res.status(403).json({ message: "Bạn không có quyền truy cập" });
        }
        break;
      default:
        break;
    }
    res.redirect("back");
  } catch (err) {
    res.send(err);
  }
};
// [GET] /admin/category/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const permissions = res.locals.role.permissions;
    if (permissions && permissions.includes("products-category_view")) {
      const { id } = req.params;
      const category = await Category.findOne({ _id: id, deleted: false });
      if (category.parent_id) {
        var parent = await Category.findOne({ _id: category.parent_id });
        category.parent = parent.title;
      }
      res.render("admin/pages/category/detail", {
        pageTitle: category.title,
        record: category,
      });
    } else {
      res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }
  } catch (e) {
    req.flash("error", "Danh mục không tồn tại!");
    res.redirect("back");
  }
};
//[PATCH] /admin/category/change-status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const permissions = res.locals.role.permissions;
    if (permissions && permissions.includes("products-category_edit")) {
      const { status, id } = req.params;
      if (status !== "active" && status !== "inactive") {
        return res.redirect("back");
      }
      await Category.updateOne({ _id: id }, { status: status });
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
