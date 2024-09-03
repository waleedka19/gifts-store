const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const multer = require("multer");
const MONGODB_URI = "mongodb://127.0.0.1:27017/gifto";
const session = require("express-session");
const flash = require("connect-flash");
const MongoDBstore = require("connect-mongodb-session")(session);
const app = express();
const store = new MongoDBstore({
  uri: "mongodb://127.0.0.1:27017/gifto",
  collection: "sessions",
});
const bodyParser = require("body-parser");
const shopRoutes = require("./routes/shop");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

app.set("view engine", "ejs");
app.set("views", "views");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "veryverysecretpassword",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
  })
);
app.use(flash());

app.use(express.static(path.join(__dirname, "public")));

app.use("/images", express.static(path.join(__dirname, "images")));

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname +
        "-" +
        new Date().toISOString().replace(/:/g, "-") +
        "-" +
        file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};

app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
  }).single("image")
);
app.use(shopRoutes);
app.use(authRoutes);
app.use("/admin", adminRoutes);

mongoose.connect(MONGODB_URI);

const db = mongoose.connection;

db.on("error", (err) => {
  console.error("Error connecting to MongoDB:", err);
});

db.once("open", () => {
  console.log("Connected to MongoDB");

  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
});
