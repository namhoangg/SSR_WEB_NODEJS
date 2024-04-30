const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
//[POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
  try {
    const productId = req.params.productId;
    const quantity = req.body.quantity;
    const cartId = req.cookies.cartId;
    const cart = await Cart.findOne({ _id: cartId });
    if (!cart) {
      res.redirect("/products");
      return;
    }
    const existProduct = cart.products.find(
      (item) => item.product_id == productId
    );
    if (existProduct) {
      const newQuantity = parseInt(existProduct.quantity) + parseInt(quantity);
      await Cart.updateOne(
        { _id: cartId, "products.product_id": productId },
        { $set: { "products.$.quantity": newQuantity } }
      );
    } else {
      const objectCart = {
        product_id: productId,
        quantity: quantity,
      };
      await Cart.updateOne(
        { _id: cartId },
        { $push: { products: objectCart } }
      );
    }
    req.flash("success", "Thêm sản phẩm vào giỏ hàng thành công");
    res.redirect("back");
  } catch (e) {
    req.flash("error", "Có lỗi xảy ra");
    res.redirect("back");
  }
};
//[GET] /cart
module.exports.index = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const cart = await Cart.findOne({
      _id: cartId,
    });
    if (cart.products.length > 0) {
      for (const item of cart.products) {
        const productId = item.product_id;
        const productInfo = await Product.findOne({
          _id: productId,
        }).select("title thumbnail slug price discountPercentage");
        productInfo.priceNew = (
          (productInfo.price * (100 - productInfo.discountPercentage)) /
          100
        ).toFixed(0);
        productInfo.totalPrice = item.quantity * productInfo.priceNew;
        item.productInfo = productInfo;
        item.totalPrice = productInfo.totalPrice;
      }
    }
    cart.totalPrice = cart.products.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );
    res.render("client/pages/cart/index", {
      title: "Cart",
      cartDetail: cart,
    });
  } catch (e) {
    console.log(e);
    res.redirect("/");
  }
};
//[GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
  try {
    const productId = req.params.productId;
    const cartId = req.cookies.cartId;
    await Cart.updateOne(
      { _id: cartId },
      { $pull: { products: { product_id: productId } } }
    );
    req.flash("success", "Xóa sản phẩm khỏi giỏ hàng thành công");
    res.redirect("back");
  } catch (e) {
    req.flash("error", "Có lỗi xảy ra");
    res.redirect("back");
  }
};
// //[GET] /cart/update/:id/:quantity
module.exports.update = async (req, res) => {
  try {
    const id = req.params.productId;
    const quantity = parseInt(req.params.quantity);
    const cart = await Cart.updateOne(
      {
        _id: req.cookies.cartId,
        "products.product_id": id,
      },
      {
        $set: {
          "products.$.quantity": quantity,
        },
      }
    );
    req.flash("success", "Cập nhật giỏ hàng thành công");
    res.redirect("back");
  } catch (error) {
    req.flash("error", "Có lỗi xảy ra");
    res.redirect("back");
  }
};
