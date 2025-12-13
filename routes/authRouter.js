const express = require("express");
const router = express.Router();
const { loginController, logoutController,checkAuth} = require("../controllers/authController");
const {authMiddleware} = require('../middleware/authMiddleware.js')

router.get("/checkAuth",authMiddleware ,checkAuth);
router.post("/login", loginController);
router.post("/loguot", logoutController);
module.exports = router;
