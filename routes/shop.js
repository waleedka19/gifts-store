const express = require("express");
const router = express.Router();
const shopCntrl = require("../controller/shop");
const isAuth = require("../middleware/isAuth");

router.get("/", isAuth, shopCntrl.getIndex);
router.get("/shop/products", isAuth, shopCntrl.getAllProducts);
router.get("/products/:prodId", isAuth, shopCntrl.getOneProduct);
router.get("/shop/booking", isAuth, shopCntrl.getBooking);
router.post("/shop/booking", isAuth, shopCntrl.postBooking);
router.get("/shop/cart", isAuth, shopCntrl.getCart);
router.post("/shop/cart", isAuth, shopCntrl.postCart);
router.post("/shop/cart-delete-item", isAuth, shopCntrl.postCartDeleteProduct);
router.post("/shop/order", isAuth, shopCntrl.postOrder);
router.get("/shop/order", isAuth, shopCntrl.getOrders);
router.get("/shop/checkout", isAuth, shopCntrl.getCheckout);
router.get("/shop/checkout/success", isAuth, shopCntrl.getCheckoutSuccess);
router.get("/shop/checkout/cancel", isAuth, shopCntrl.getCheckout);
module.exports = router;
