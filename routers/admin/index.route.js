const dashboardRouter = require("./dashboard.route");
const systemConfig = require("../../configs/system");
const productRouter = require("./product.route");
const categoryRouter = require("./category.route");
const roleRouter = require("./role.route");
const accountRouter = require("./account.route");
const authRouter = require("./auth.route");
const authMiddleware = require("../../middlewares/admin/auth.middleware");
const myAccountRouter = require("./my-account.route");
module.exports = (app) => {
  const PATH = systemConfig.prefixAdmin;
  app.use(PATH + "/dashboard", authMiddleware.requireAuth, dashboardRouter);
  app.use(PATH + "/products", authMiddleware.requireAuth, productRouter);
  app.use(PATH + "/category", authMiddleware.requireAuth, categoryRouter);
  app.use(PATH + "/roles", authMiddleware.requireAuth, roleRouter);
  app.use(PATH + "/accounts", authMiddleware.requireAuth, accountRouter);
  app.use(PATH + "/my-account", authMiddleware.requireAuth, myAccountRouter);
  app.use(PATH + "/auth", authRouter);
};
