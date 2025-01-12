const express = require("express");
const router = express.Router();
const { loginController, logoutController } = require("../controllers/authController");

router.post("/login", loginController);
router.post("/loguot", logoutController);
module.exports = router;
