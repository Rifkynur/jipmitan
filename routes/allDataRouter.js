const express = require("express");
const router = express.Router();
const { getAllData, getTotalIncomePerRt, getIncomePerMonthPerRt, getDetailIncomePerQuarter } = require("../controllers/allDataController");

router.get("/alldata", getAllData);
router.get("/allIncomePerRt", getTotalIncomePerRt);
router.get("/incomePerMonth", getIncomePerMonthPerRt);
router.get("/incomePerQuarter", getDetailIncomePerQuarter);
module.exports = router;
