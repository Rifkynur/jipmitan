const express = require("express");
const router = express.Router();
const {
  authMiddleware,
  permissionUser,
} = require("../middleware/authMiddleware");
const {
  getIncome,
  getDetailIncome,
  addIncome,
  deleteIncome,
  updateIncome,
  getTotalIncome,
} = require("../controllers/incomeController");

router.get("/income", getIncome);
router.get("/total-income", getTotalIncome);
router.get("/income/:id", getDetailIncome);
router.post("/income", authMiddleware, addIncome);
router.patch("/income/:id", authMiddleware, updateIncome);
router.delete("/income/:id", authMiddleware, deleteIncome);
module.exports = router;
