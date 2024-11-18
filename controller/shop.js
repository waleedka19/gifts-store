const Product = require("../model/product");
const Booking = require("../model/booking");
const Order = require("../model/order");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
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

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        user: req.session.user,
        pageTitle: "Your Cart",
        products: products,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect("/shop/cart");
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect("/shop/cart");
    })
    .catch((err) => console.log(err));
};
exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, productData: { ...i.productId._doc } };
      });

      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user._id,
        },
        products: products,
      });

      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/shop/order");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      console.log(orders);
      res.render("shop/orders", {
        pageTitle: "Your Orders",
        user: req.session.user,
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};
exports.getCheckout = (req, res, next) => {
  let products;
  let total = 0;

  req.user
    .populate("cart.items.productId")
    .then((user) => {
      products = user.cart.items;
      total = 0;
      products.forEach((p) => {
        total += p.quantity * p.productId.price;
      });

      return stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: products.map((p) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: p.productId.title,
              description: p.productId.description,
            },
            unit_amount: p.productId.price * 100,
          },
          quantity: p.quantity,
        })),
        mode: "payment",
        success_url: `${req.protocol}://${req.get(
          "host"
        )}/shop/checkout/success`,
        cancel_url: `${req.protocol}://${req.get("host")}/shop/checkout/cancel`,
      });
    })
    .then((session) => {
      res.render("shop/checkout", {
        pageTitle: "Checkout",
        products: products,
        totalSum: total,
        sessionId: session.id,
        user: req.session.user,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getCheckoutSuccess = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, productData: { ...i.productId._doc } };
      });

      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user._id,
        },
        products: products,
      });

      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/shop/order");
    })
    .catch((err) => {
      console.log(err);
    });
};
