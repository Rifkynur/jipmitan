const express = require("express");
const router = express.Router();
const {
  getAllData,
  getTotalIncomeMonthlyPerRtPerYear,
  getDetailIncomePerQuarter,
  getTotalIncomePerMonthPerRtPerYear,
} = require("../controllers/allDataController");

router.get("/alldata", getAllData);
router.get(
  "/totalIncomeMonthlyPerRtPeryearPerRt",
  getTotalIncomeMonthlyPerRtPerYear
);
router.get("/incomePerMonth", getTotalIncomePerMonthPerRtPerYear);
// router.get("/incomePerQuarter", getDetailIncomePerQuarter);
module.exports = router;
