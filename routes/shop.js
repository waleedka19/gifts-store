const express = require("express");
const router = express.Router();
const shopCntrl = require("../controller/shop");
const isAuth = require("../middleware/isAuth");

router.get("/", isAuth, shopCntrl.getIndex);
router.get("/shop/products", isAuth, shopCntrl.getAllProducts);
router.get("/products/:prodId", isAuth, shopCntrl.getOneProduct);
router.get("/shop/booking", isAuth, shopCntrl.getBooking);
router.post("/shop/booking", isAuth, shopCntrl.postBooking);
module.exports = router;
