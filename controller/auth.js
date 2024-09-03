const User = require("../model/user");
const bcrypt = require("bcryptjs");
exports.getSignUp = (req, res, next) => {
  res.render("shop/signup", {
    pageTitle: "انشاء حساب ",
    messages: req.flash("error"),
  });
};

exports.postSignUp = (req, res, next) => {
  const fullname = req.body.fullName;
  const email = req.body.email;
  const password = req.body.password;
  const rePassword = req.body.rePassword;

  if (password !== rePassword) {
    req.flash("error", "كلمة السر غير متطابقة");
    return res.redirect("/signup");
  }
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "هذا البريد الالكتروني مستخدم من قبل");
        return res.redirect("/signup");
      }
      return bcrypt.hash(password, 12);
    })
    .then((hashedpassowrd) => {
      const user = new User({
        name: fullname,
        email: email,
        password: hashedpassowrd,
      });
      return user.save();
    })
    .then((result) => {
      console.log("user created");
      req.flash("success", "تم انشاء الحساب بنجاح");

      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
      req.flash("error", "حدث خطأ أثناء عملية الإنشاء");
    });
};

exports.getLogin = (req, res, next) => {
  res.render("shop/login", {
    pageTitle: "تسجيل الدخول ",
    messages: req.flash("error"),
    successMessages: req.flash("success"),
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      req.flash("error", "لا يوجد حساب بهذا البريد الالكتروني");
      console.log("No user found");
      return res.redirect("/login");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      await req.session.save();
      return res.redirect("/");
    } else {
      req.flash("error", " كلمة سر خاطئة  ");
      return res.redirect("/login");
    }
  } catch (err) {
    console.log(err);
    req.flash("error", " حصل خطا في تسجيل الدخول ");
    return res.redirect("/login");
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
