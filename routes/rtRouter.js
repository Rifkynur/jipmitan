const express = require("express");
const router = express.Router();
const {
  authMiddleware,
  permissionUser,
} = require("../middleware/authMiddleware");

const { getAllRt, detailRt } = require("../controllers/rtController");

router.get("/rt", authMiddleware, getAllRt);
router.get("/rt/:id", authMiddleware, detailRt);
module.exports = router;
