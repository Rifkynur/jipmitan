const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  startOfYear,
  endOfYear,
  startOfQuarter,
  endOfQuarter,
} = require("date-fns");

// mengambil total pemasukan dana, total pemasukan dan total pengeluaran
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

    const totalIncome = incomes.reduce(
      (total, income) => total + income.amount,
      0
    );
    const totalExpense = expense.reduce(
      (total, expense) => total + expense.amount,
      0
    );
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

// mengambil total income perbulan pertahun disetiap rt
/*
  {
    "rtIName": "09",
    "month": "August",
     "total": 150000
  },

*/
exports.getTotalIncomeMonthlyPerRtPerYear = async (req, res) => {
  const year = parseInt(req.query.year) || 2025;
  const rt = req.query.rt || "09";
  try {
    const incomes = await prisma.income.findMany({
      where: {
        deletedAt: null,
        date: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`),
        },
        Member: {
          rt: {
            name: rt,
          },
        },
      },
      include: {
        Member: {
          include: {
            rt: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const grouped = {};

    incomes.forEach((income) => {
      const rtName = income.Member?.rt?.name;
      if (!rtName) return;

      const month = new Date(income.date).toLocaleString("id-ID", {
        month: "long",
      });
      const monthIndex = new Date(income.date).getMonth();

      const key = `${rtName}-${month}`;

      if (!grouped[key]) {
        grouped[key] = {
          rtName,
          month,
          total: 0,
          monthIndex,
        };
      }

      grouped[key].total += income.amount;
    });
    const sorted = Object.values(grouped).sort(
      (a, b) => a.monthIndex - b.monthIndex
    );
    res.status(200).json({
      data: sorted,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "failed",
      msg: "internal server error",
    });
  }
};

/* MENGAMBIL TOTAL INCOME PERBULAN DISETIAP TAHUN PER RT
  {
    "rt": "09",
    "total": 150000
  },
  {
    "rt" : "11",
    "total" : 20000
  }

*/

exports.getTotalIncomePerMonthPerRtPerYear = async (req, res) => {
  const year = req.query.year || 2025;

  try {
    const incomes = await prisma.income.findMany({
      where: {
        deletedAt: null,
        date: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`),
        },
      },
      include: {
        Member: {
          include: {
            rt: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    const totalByRt = incomes.reduce((acc, income) => {
      const rtName = income.Member?.rt?.name || "Unknown";

      const existing = acc.find((item) => item.rt === rtName);
      if (existing) {
        existing.total += income.amount;
      } else {
        acc.push({
          rt: rtName,
          total: income.amount,
        });
      }

      return acc;
    }, []);

    res.status(200).json({
      data: totalByRt,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "failed",
      msg: "internal server error",
    });
  }
};

// BELUM KELAR

exports.getDetailIncomePerQuarter = async (req, res) => {
  const year = req.query.year || "2022";
  const quarter = req.query.quarter || "4";
  const rt = req.query.rt || "09";

  const quarterStartMonth = (quarter - 1) * 3; // Januari (0-indexed), April, dst.

  // Tanggal awal dan akhir kuartal
  const startDate = new Date(Date.UTC(year, quarterStartMonth, 1)); // Tanggal 1 bulan awal kuartal
  const endDate = new Date(Date.UTC(year, quarterStartMonth + 3, 0)); // Tanggal 0 => akhir bulan sebelumnya

  try {
    const incomes = await prisma.income.findMany({
      where: {
        deletedAt: null,
        date: {
          gte: startDate,
          lte: endDate,
        },
        Member: {
          rt: {
            name: rt, // ini memfilter berdasarkan nama RT
          },
        },
      },
      include: {
        Member: {
          include: {
            rt: true, // ini hanya untuk ambil data rt juga dalam hasil
          },
        },
      },
    });

    incomes.sort((a, b) => new Date(a.date) - new Date(b.date));
    res.status(200).json({
      incomes,
    });
  } catch (error) {
    console.log(error);
  }
};
