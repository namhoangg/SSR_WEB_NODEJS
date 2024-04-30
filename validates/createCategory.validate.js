module.exports.create = async (req, res, next) => {
  if (!req.body.title) {
    req.flash("error", "Title is required!!");
    return res.redirect("back");
  }
  next();
};
