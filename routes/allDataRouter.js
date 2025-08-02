const express = require("express");
const router = express.Router();
const {
  getAllData,
  getTotalIncomeMonthlyPerRtPerYear,
  getIncomePerMonthPerRt,
  getDetailIncomePerQuarter,
} = require("../controllers/allDataController");

router.get("/alldata", getAllData);
router.get(
  "/totalIncomeMonthlyPerRtPeryearPerRt",
  getTotalIncomeMonthlyPerRtPerYear
);
router.get("/incomePerMonth", getIncomePerMonthPerRt);
router.get("/incomePerQuarter", getDetailIncomePerQuarter);
module.exports = router;
