const express = require("express");
const router = express.Router();
const {
  authMiddleware,
  permissionUser,
} = require("../middleware/authMiddleware");

const { getAllRoles, detailRoles } = require("../controllers/roleController");

router.get("/roles", authMiddleware, getAllRoles);
router.get("/roles/:id", authMiddleware, detailRoles);
module.exports = router;
