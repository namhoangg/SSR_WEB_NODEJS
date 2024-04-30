module.exports.create = async (req, res,next) => {
  if(!req.body.title){
    req.flash("error", "Title is required!!");
    return res.redirect("back");
  }
  if(!req.body.price){
    req.flash("error", "Price is required!!");
    return res.redirect("back");
  }
  if(!req.body.stock){
    req.flash("error", "Stock is required!!");
    return res.redirect("back");
  }
  next();
}