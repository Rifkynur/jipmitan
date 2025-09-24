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
} = require("../controllers/incomeController");

router.get("/income", getIncome);
router.get("/income/:id", getDetailIncome);
router.post("/income", authMiddleware, addIncome);
router.patch("/income/:id", authMiddleware, updateIncome);
router.put("/income/delete/:id", authMiddleware, deleteIncome);
module.exports = router;
