const express = require("express");
const router = express.Router();
const {
  getExpense,
  getDetailExpense,
  addExpense,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");
const {
  authMiddleware,
  permissionUser,
} = require("../middleware/authMiddleware");

router.get("/expense", getExpense);
router.get("/expense/:id", getDetailExpense);
router.post("/expense", authMiddleware, addExpense);
router.patch("/expense/:id", authMiddleware, updateExpense);
router.delete("/expense/:id", authMiddleware, deleteExpense);
module.exports = router;
