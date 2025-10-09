const express = require("express");
const router = express.Router();
const {
  authMiddleware,
  permissionUser,
} = require("../middleware/authMiddleware");

const { getAllRt, detailRt } = require("../controllers/rtController");

router.get("/rt", getAllRt);
router.get("/rt/:id", detailRt);
module.exports = router;
