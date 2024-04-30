const express = require("express");
const app = express();

// Pug
app.set("views", __dirname + "/views");
app.set("view engine", "pug");

//.env
require("dotenv").config();
const port = process.env.PORT;

//System variables
const systemConfig = require("./configs/system");
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// Static files
app.use(express.static(__dirname + "/public"));

// Connect to database
const database = require("./configs/database");
database.connect();

//method-override
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

//tinyMCE
const path = require("path");
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);

// Body parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

//Express-flash
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
app.use(cookieParser("secret"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

//Moment
const moment = require("moment");
app.locals.moment = moment;

// Routers
const adminRouter = require("./routers/admin/index.route");
const clientRouter = require("./routers/client/index.route");
adminRouter(app);
clientRouter(app);

// Run server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
