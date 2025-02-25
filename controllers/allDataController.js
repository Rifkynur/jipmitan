const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { startOfYear, endOfYear, startOfQuarter, endOfQuarter } = require("date-fns");

exports.getAllData = async (req, res) => {
  try {
    const incomes = await prisma.income.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        amount: true,
      },
    });
    const expense = await prisma.expense.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        amount: true,
      },
    });

    const totalIncome = incomes.reduce((total, income) => total + income.amount, 0);
    const totalExpense = expense.reduce((total, expense) => total + expense.amount, 0);
    const totalDana = totalIncome - totalExpense;
    res.status(200).json({
      data: {
        totalDana,
        totalIncome,
        totalExpense,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "failed",
      msg: "internal server error",
    });
  }
};

exports.getTotalIncomePerRt = async (req, res) => {
  const year = req.query.year || 2022;
  try {
    const totalIncomePerRt = await prisma.income.groupBy({
      by: ["rt"],
      _sum: {
        amount: true,
      },
      where: {
        deletedAt: null,
        date: {
          gte: startOfYear(new Date(year)), // Awal tahun
          lte: endOfYear(new Date(year)), // Akhir tahun
        },
      },
    });

    res.status(200).json({
      data: totalIncomePerRt,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "failed",
      msg: "internal server error",
    });
  }
};

exports.getIncomePerMonthPerRt = async (req, res) => {
  const year = req.query.year || 2022;

  try {
    const incomeData = await prisma.income.groupBy({
      by: ["rt", "date"], // Mengelompokkan berdasarkan RT dan Tanggal
      _sum: {
        amount: true, // Menghitung total pemasukan
      },
      where: {
        deletedAt: null,
        date: {
          gte: startOfYear(new Date(year)), // Awal tahun
          lte: endOfYear(new Date(year)), // Akhir tahun
        },
      },
    });
    const formattedData = incomeData.reduce((acc, item) => {
      const month = new Date(item.date).getMonth() + 1; // Ekstrak bulan (1-12)
      const existingData = acc.find((entry) => entry.rt === item.rt && entry.month === month);

      if (existingData) {
        // Jika data untuk RT dan bulan yang sama sudah ada, tambahkan jumlah amount-nya
        existingData.totalAmount += item._sum.amount;
      } else {
        // Jika belum ada, tambahkan data baru
        acc.push({
          rt: item.rt,
          month: month,
          totalAmount: item._sum.amount,
        });
      }

      return acc;
    }, []);

    res.status(200).json({
      data: formattedData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "failed",
      msg: "internal server error",
    });
  }
};

exports.getDetailIncomePerQuarter = async (req, res) => {
  const year = req.query.year || "2022";
  const quarter = req.query.quarter || "1";
  const rt = req.query.rt || "rt09";

  const quarterStartMonth = (quarter - 1) * 3; // Januari (0-indexed), April, dst.

  // Tanggal awal dan akhir kuartal
  const startDate = new Date(Date.UTC(year, quarterStartMonth, 1)); // Tanggal 1 bulan awal kuartal
  const endDate = new Date(Date.UTC(year, quarterStartMonth + 3, 0)); // Tanggal 0 => akhir bulan sebelumnya

  try {
    const income = await prisma.income.findMany({
      where: {
        deletedAt: null,
        rt,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    income.sort((a, b) => new Date(a.date) - new Date(b.date));
    res.status(200).json({
      income,
    });
  } catch (error) {
    console.log(error);
  }
};
