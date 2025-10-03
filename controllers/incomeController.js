const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// MENGAMBIL DETAIL PEMASUKAN SELAMA 1 TAHUN
exports.getIncome = async (req, res) => {
  const year = req.query.year || "2025";
  const rt = req.query.rt;
  try {
    const incomes = await prisma.income.findMany({
      where: {
        date: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`),
        },
        ...(rt
          ? {
              Member: {
                is: {
                  rt: {
                    name: rt,
                  },
                },
              },
            }
          : {}),
      },
      select: {
        id: true, // ⬅️ income.id ikut diminta
        amount: true,
        date: true,
        Member: {
          select: {
            id: true,
            name: true,
            rt: { select: { name: true } },
          },
        },
      },
    });
    const groupedByRT = {};

    incomes.forEach((income) => {
      const rtName = income.Member.rt.name;
      const memberName = income.Member.name;
      const dateKey = income.date.toISOString().split("T")[0]; // YYYY-MM-DD

      if (!groupedByRT[rtName]) {
        groupedByRT[rtName] = {};
      }

      if (!groupedByRT[rtName][memberName]) {
        groupedByRT[rtName][memberName] = {};
      }

      if (!groupedByRT[rtName][memberName][dateKey]) {
        groupedByRT[rtName][memberName][dateKey] = [];
      }

      groupedByRT[rtName][memberName][dateKey].push({
        id: income.id,
        amount: income.amount,
      });
    });

    const result = Object.entries(groupedByRT).map(([rt, members]) => ({
      rt,
      members: Object.entries(members).map(([name, weeklyAmounts]) => ({
        name,
        weeklyAmounts,
      })),
    }));

    return res.status(200).json({
      status: "success",
      result,
    });
  } catch (error) {
    console.error("Error fetching income:", error);

    res.status(500).json({
      status: "failed",
      msg: "something wrong",
    });
  }
};

// MENGAMBIL DETAIL INCOME (DONE)

exports.getDetailIncome = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await prisma.income.findUnique({
      where: {
        id,
      },
      include: {
        Member: {
          include: {
            rt: true,
          },
        },
      },
    });
    if (!data) {
      return res.status(404).json({
        status: "failed",
        msg: "data tidak ditemukan",
      });
    }

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      msg: "internal server error",
    });
  }
};

// MENAMBAHKAN INCOME (DONE)

exports.addIncome = async (req, res) => {
  try {
    const { amount, date, desc, rtId, memberId } = req.body;

    const roleUser = await prisma.role.findUnique({
      where: {
        id: req.user.roleId,
      },
    });

    const rt = await prisma.rt.findUnique({
      where: {
        id: rtId,
      },
    });
    // console.log(rt);

    if (roleUser.name != rt.name && roleUser.name != "admin") {
      return res.status(403).json({
        status: "failed",
        msg: "masukan rt dengan benar",
      });
    }

    const newData = await prisma.income.create({
      data: {
        userId: req.user.id,
        amount,
        // rtId,
        desc,
        memberId,
        date: new Date(date),
      },
    });

    return res.status(201).json({
      status: "success",
      newData,
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      status: "failed",
      msg: "internal server error",
    });
  }
};

exports.updateIncome = async (req, res) => {
  try {
    const { amount, date } = req.body;
    const { id } = req.params;
    const roleUser = await prisma.role.findUnique({
      where: {
        id: req.user.roleId,
      },
    });

    const findIncome = await prisma.income.findUnique({
      where: {
        id,
      },
      include: {
        Member: {
          include: {
            rt: true,
          },
        },
      },
    });

    console.log(findIncome);

    if (!findIncome) {
      return res.status(404).json({
        status: "failed",
        msg: "data tidak ditemukan",
      });
    }

    if (
      roleUser.name != findIncome?.Member?.rt?.name &&
      roleUser.name != "admin"
    ) {
      return res.status(403).json({
        status: "failed",
        msg: "masukan rt dengan benar",
      });
    }

    const updatedIncome = await prisma.income.update({
      where: {
        id,
      },
      data: {
        amount,
        date: new Date(date),
        updatedAt: new Date(Date.now()),
      },
    });

    return res.status(201).json({
      status: "success",
      updatedIncome,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      status: "failed",
      msg: "internal server error",
    });
  }
};

exports.deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const findIncome = await prisma.income.findUnique({
      where: {
        id,
      },
    });

    if (!findIncome) {
      return res.status(404).json({
        status: "failed",
        msg: "data tidak ditemukan",
      });
    }
    const roleUser = await prisma.role.findUnique({
      where: {
        id: req.user.roleId,
      },
    });

    const rt = await prisma.rt.findFirst({
      where: {
        id: findIncome.rtId,
      },
    });

    if (roleUser.name != rt.name && roleUser.name != "admin") {
      return res.status(401).json({
        status: "failed",
        msh: "anda tidak punya akses kesini",
      });
    }

    const deletedIncome = await prisma.income.delete({ where: { id } });

    return res.status(201).json({
      status: "success",
      msg: "Berhasil Menghapus Data",
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      status: "failed",
      msg: "internal server error",
    });
  }
};
