const express = require("express");
const router = express.Router();
const { getExpense, getDetailExpense, addExpense, updateExpense, deleteExpense } = require("../controllers/expenseController");
const { authMiddleware, permissionUser } = require("../middleware/authMiddleware");

router.get("/expense", getExpense);
router.get("/expense/:id", getDetailExpense);
router.post("/expense", authMiddleware, permissionUser("leader", "superAdmin"), addExpense);
router.put("/expense/:id", authMiddleware, permissionUser("leader", "superAdmin"), updateExpense);
router.put("/expense/delete/:id", authMiddleware, permissionUser("leader", "superAdmin"), deleteExpense);
module.exports = router;
