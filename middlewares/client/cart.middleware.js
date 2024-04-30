const Cart = require("../../models/cart.model");
module.exports.cartId = async (req, res, next) => {
  if (!req.cookies.cartId) {
    //not have cartId or not login yet
    const cart = new Cart();
    await cart.save();
    const expireTime = 365 * 24 * 60 * 60 * 1000;
    res.cookie("cartId", cart.id, {
      expires: new Date(Date.now() + expireTime),
    });
  } else {
    const cart=await Cart.findOne({_id:req.cookies.cartId});
    const totalQuantity=cart.products.reduce((total,item)=>total+item.quantity,0);
    cart.totalQuantity=totalQuantity; 
    res.locals.miniCart=cart;
  }
  next();
};

