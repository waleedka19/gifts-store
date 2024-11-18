const User = require("../model/user");
const bcrypt = require("bcryptjs");
const MailerSend = require("mailersend").MailerSend;
const EmailParams = require("mailersend").EmailParams;
const Sender = require("mailersend").Sender;
const Recipient = require("mailersend").Recipient;
const mailersend = new MailerSend({
  apiKey: process.env.MAILERSAND_API_KEY,
});

const sentFrom = new Sender(process.env.MAILERSAND_DOMAIN_EMAIL, "Waleed");

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
    .then((hashedPassword) => {
      const user = new User({
        name: fullname,
        email: email,
        password: hashedPassword,
      });
      return user.save();
    })
    .then((result) => {
      console.log("User created");

      const recipients = [new Recipient(email, fullname)];
      const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setReplyTo(sentFrom)
        .setSubject("Welcome to Our Platform!")
        .setHtml(
          `<p>Dear ${fullname},</p><p>Thank you for signing up!</p><p>Best Regards,<br>Waleed</p>`
        )
        .setText(
          `Dear ${fullname},\n\nThank you for signing up!\n\nBest Regards,\nWaleed`
        );

      return mailersend.email.send(emailParams);
    })
    .then(() => {
      req.flash("success", "تم انشاء الحساب بنجاح");
      res.redirect("/login");
    })
    .catch((err) => {
      console.error("Error during signup:", err);

      if (err?.body?.message) {
        req.flash("error", `MailerSend Error: ${err.body.message}`);
      } else {
        req.flash("error", "حدث خطأ أثناء عملية الإنشاء");
      }

      res.redirect("/signup");
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
