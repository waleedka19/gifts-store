const express = require("express");
const router = express.Router();
const authCntrl = require("../controller/auth");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/signup", isLoggedIn, authCntrl.getSignUp);

router.post("/signup", isLoggedIn, authCntrl.postSignUp);

router.get("/login", isLoggedIn, authCntrl.getLogin);

router.post("/login", isLoggedIn, authCntrl.postLogin);

router.post("/logout", authCntrl.postLogout);

module.exports = router;
