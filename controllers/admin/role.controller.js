const Role = require("../../models/role.model");
//[GET] /admin/roles
module.exports.index = async (req, res) => {
  try {
    const permissions = res.locals.role.permissions;
    if (permissions && permissions.includes("roles-view")) {
      let find = { deleted: false };
      const records = await Role.find(find);
      res.render("admin/pages/roles/index", {
        pageTitle: "Vai trò",
        records: records,
      });
    } else {
      res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }
  } catch (e) {
    res.send(e);
  }
};
//[GET] /admin/roles/create
module.exports.create = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if (permissions && permissions.includes("roles-create")) {
    res.render("admin/pages/roles/create", {
      pageTitle: "Tạo vai trò",
    });
  } else {
    res.status(403).json({ message: "Bạn không có quyền truy cập" });
  }
};
//[POST] /admin/roles/create
module.exports.postCreate = async (req, res) => {
  try {
    const permissions = res.locals.role.permissions;
    if (permissions && permissions.includes("roles-create")) {
      const role = new Role(req.body);
      await role.save();
      req.flash("success", "Tạo vai trò thành công!");
      res.redirect("/admin/roles");
    } else {
      res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }
  } catch (e) {
    req.flash("error", "Tạo vai trò thất bại!");
    res.redirect("/admin/roles/create");
  }
};
//[GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if (permissions && permissions.includes("roles-edit")) {
    const { id } = req.params;
    const role = await Role.findById(id);
    res.render("admin/pages/roles/edit", {
      pageTitle: "Chỉnh sửa vai trò",
      role: role,
    });
  } else {
    res.status(403).json({ message: "Bạn không có quyền truy cập" });
  }
};
//[PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const permissions = res.locals.role.permissions;
    if (permissions && permissions.includes("roles-edit")) {
      const { id } = req.params;
      const role = await Role.updateOne({ _id: id }, req.body);
      req.flash("success", "Chỉnh sửa vai trò thành công!");
      res.redirect("back");
    } else {
      res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }
  } catch (e) {
    req.flash("error", "Chỉnh sửa vai trò thất bại!");
    res.redirect("back");
  }
};
//[GET] /admin/roles/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const permissions = res.locals.role.permissions;
    if (permissions && permissions.includes("roles-view")) {
      const { id } = req.params;
      const role = await Role.findById(id);
      res.render("admin/pages/roles/detail", {
        pageTitle: role.title,
        role: role,
      });
    } else {
      res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }
  } catch (e) {
    req.flash("error", "Vai trò không tồn tại!");
    res.redirect("/admin/roles");
  }
};
//[DELETE] /admin/roles/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const permissions = res.locals.role.permissions;
    if (permissions && permissions.includes("roles-delete")) {
      const { id } = req.params;
      await Role.updateOne({ _id: id }, { deleted: true });
      req.flash("success", "Xóa vai trò thành công!");
      res.redirect("back");
    } else {
      res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }
  } catch (e) {
    req.flash("error", "Xóa vai trò thất bại!");
    res.redirect("back");
  }
};
//[GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if (permissions && permissions.includes("roles-permissions")) {
    const validPermissions = [
      {
        name: "Danh mục sản phẩm",
        permissions: [
          {
            name: "Xem",
            code: "products-category_view",
          },
          {
            name: "Tạo mới",
            code: "products-category_create",
          },
          {
            name: "Chỉnh sửa",
            code: "products-category_edit",
          },
          {
            name: "Xóa",
            code: "products-category_delete",
          },
        ],
      },
      {
        name: "Sản phẩm",
        permissions: [
          {
            name: "Xem",
            code: "products-view",
          },
          {
            name: "Tạo mới",
            code: "products-create",
          },
          {
            name: "Chỉnh sửa",
            code: "products-edit",
          },
          {
            name: "Xóa",
            code: "products-delete",
          },
        ],
      },
      {
        name: "Vai trò",
        permissions: [
          {
            name: "Xem",
            code: "roles-view",
          },
          {
            name: "Tạo mới",
            code: "roles-create",
          },
          {
            name: "Chỉnh sửa",
            code: "roles-edit",
          },
          {
            name: "Xóa",
            code: "roles-delete",
          },
          {
            name: "Phân quyền",
            code: "roles-permissions",
          },
        ],
      },
      {
        name: "Tài khoản",
        permissions: [
          {
            name: "Xem",
            code: "accounts-view",
          },
          {
            name: "Tạo mới",
            code: "accounts-create",
          },
          {
            name: "Chỉnh sửa",
            code: "accounts-edit",
          },
          {
            name: "Xóa",
            code: "accounts-delete",
          },
          {
            name: "Phân quyền",
            code: "accounts-permissions",
          },
        ],
      },
    ];
    const records = await Role.find({ deleted: false });
    res.render("admin/pages/roles/permissions", {
      pageTitle: "Permissions",
      records: records,
      validPermissions: validPermissions,
    });
  } else {
    res.status(403).json({ message: "Bạn không có quyền truy cập" });
  }
};
//[PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
  try {
    const permiss = res.locals.role.permissions;
    if (permiss && permiss.includes("roles-permissions")) {
      const validPermissions = [
        "products-category_view",
        "products-category_create",
        "products-category_edit",
        "products-category_delete",
        "products-view",
        "products-create",
        "products-edit",
        "products-delete",
        "roles-view",
        "roles-create",
        "roles-edit",
        "roles-delete",
        "roles-permissions",
        "accounts-view",
        "accounts-create",
        "accounts-edit",
        "accounts-delete",
        "accounts-permissions",
      ];
      const permissions = JSON.parse(req.body.permissions);
      for (role of permissions) {
        role.permissions.filter((p) => {
          validPermissions.includes(p);
        });
        await Role.updateOne(
          { _id: role.id },
          { permissions: role.permissions }
        );
      }
      req.flash("success", "Chỉnh sửa phân quyền thành công!");
      // res.send("200");
      res.redirect("back");
    } else {
      res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }
  } catch (e) {
    req.flash("error", "Chỉnh sửa phân quyền thất bại!");
    res.redirect("back");
  }
};
