const Product = require("../model/product");
const Booking = require("../model/booking");
exports.getIndex = (req, res, next) => {
  Product.find()
    .sort({ createdAt: -1 })
    .limit(4)
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "المتجر الرئيسي",
        user: req.session.user,
      });
    })
    .catch((err) => console.log(err));
};

exports.getAllProducts = (req, res, next) => {
  Product.find().then((products) => {
    res.render("shop/products", {
      prods: products,
      pageTitle: "جميع المنتجات",
      user: req.session.user,
    });
  });
};

exports.getOneProduct = (req, res, next) => {
  const prodId = req.params.prodId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        user: req.session.user,
      });
    })
    .catch((err) => console.log(err));
};

exports.getBooking = (req, res, next) => {
  res.render("shop/bookProduct", {
    pageTitle: "طلب هدية خاصة",
    user: req.session.user,
    messages: req.flash("messages"),
  });
};

exports.postBooking = (req, res, next) => {
  const userName = req.body.userName;
  const email = req.body.email;
  const giftName = req.body.giftName;
  const description = req.body.description;
  const booking = new Booking({
    userName: userName,
    email: email,
    giftName: giftName,
    description: description,
  });
  booking
    .save()
    .then((result) => {
      req.flash("messages", {
        type: "success",
        text: "تمت التوصية بنجاح سيتم التواصل معكن باقرب وقت ",
      });
      console.log("Book inserted");
      res.redirect("/shop/booking");
    })
    .catch((err) => {
      req.flash("messages", { type: "error", text: "حدث خطا اثناء العملية" });
      console.log(err);
    });
};
