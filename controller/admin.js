const Product = require("../model/product");
const Booking = require("../model/booking");

exports.GetAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "اضافة منتج جديد",
  });
};
exports.PostAddProduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const image = req.file;
  console.log(image);
  if (!image) {
    return res.status(422).render("admin/add-product", {
      pageTitle: "اضافة منتج جديد",
      product: {
        title: title,
        price: price,
        description: description,
      },
    });
  }

  const imageUrl = image.path;
  console.log(imageUrl);

  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
  });

  product
    .save()
    .then((result) => {
      console.log("Product inserted");
      res.redirect("/admin/admin-prodcuts");
    })
    .catch((err) => console.log(err));
};

exports.getBookingList = (req, res, next) => {
  Booking.find()
    .then((booking) => {
      res.render("admin/booking-list", {
        pageTitle: "تواصي الزبائن",
        booking: booking,
      });
    })
    .catch((err) => console.log(err));
};

exports.deleteBook = (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  Booking.findByIdAndDelete(id)
    .then((result) => {
      console.log("item delted scussfully");
      res.redirect("/admin//booking-list");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAdminPorducts = (req, res, next) => {
  Product.find().then((products) => {
    res.render("admin/admin-products", {
      prods: products,
      pageTitle: "منتجات الادمن",
    });
  });
};

exports.deleteProduct = (req, res) => {
  const id = req.params.id;
  Product.findByIdAndDelete(id)
    .then((result) => {
      console.log("product deleted scssfully");
      res.redirect("/admin/admin-prodcuts");
    })
    .catch((err) => {
      console.log(err);
    });
};
