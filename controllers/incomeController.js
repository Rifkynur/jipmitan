const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// MENGAMBIL DETAIL PEMASUKAN SELAMA 1 TAHUN
exports.getIncome = async (req, res) => {
  const rtId = req.query.rtId;
  const year = req.query.year || new Date().getFullYear();
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    // 🔹 Filter untuk Member
    const memberFilter = {};
    if (rtId && rtId !== "all") {
      memberFilter.rt = { id: rtId };
    }

    // 🔹 Ambil data Member + Income (pagination)
    const members = await prisma.member.findMany({
      where: memberFilter,
      include: {
        rt: { select: { name: true } },
        Income: {
          where: {
            ...(year &&
              year !== "all" && {
                date: {
                  gte: new Date(`${year}-01-01`),
                  lte: new Date(`${year}-12-31`),
                },
              }),
          },
          select: {
            id: true,
            amount: true,
            date: true,
          },
          orderBy: {
            date: "asc",
          },
        },
      },
      orderBy: { name: "asc" },
      skip,
      take: limit,
    });

    // 🔹 Hitung total member (untuk pagination)
    const totalMembers = await prisma.member.count({ where: memberFilter });

    // 🔹 Format hasil
    const groupedByRT = {};
    members.forEach((member) => {
      const rtName = member.rt.name;
      const memberName = member.name;

      if (!groupedByRT[rtName]) groupedByRT[rtName] = {};
      if (!groupedByRT[rtName][memberName])
        groupedByRT[rtName][memberName] = {};

      member.Income.forEach((income) => {
        const dateKey = income.date.toISOString().split("T")[0];
        if (!groupedByRT[rtName][memberName][dateKey])
          groupedByRT[rtName][memberName][dateKey] = [];

        groupedByRT[rtName][memberName][dateKey].push({
          id: income.id,
          amount: income.amount,
        });
      });
    });

    const result = Object.entries(groupedByRT).map(([rt, members]) => ({
      rt,
      members: Object.entries(members).map(([name, weeklyAmounts]) => ({
        name,
        weeklyAmounts,
      })),
    }));

    // 🔹 Kirim response
    res.status(200).json({
      page,
      totalPage: Math.ceil(totalMembers / limit),
      totalMembers,
      limit,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching incomes:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getTotalIncome = async (req, res) => {
  const rtId = req.query.rtId || "f7d8c89f-7342-4779-bf39-40a6a8adb483"; // bisa id RT (UUID)
  const rtName = req.query.rtName; // atau nama RT (opsional)
  const year = parseInt(req.query.year) || new Date().getFullYear();

  try {
    // 1) Cari RT
    let rt = null;
    if (rtId) {
      rt = await prisma.rt.findUnique({ where: { id: rtId } });
    } else if (rtName) {
      rt = await prisma.rt.findUnique({ where: { name: rtName } });
    } else {
      return res
        .status(400)
        .json({ status: "failed", msg: "rtId atau rtName wajib dikirim" });
    }

    if (!rt) {
      return res
        .status(404)
        .json({ status: "failed", msg: "RT tidak ditemukan" });
    }

    // 2) Ambil semua memberId dan userId untuk RT tersebut
    const members = await prisma.member.findMany({
      where: { rtId: rt.id },
      select: { id: true },
    });
    const memberIds = members.map((m) => m.id);

    const users = await prisma.user.findMany({
      where: { rtId: rt.id },
      select: { id: true },
    });
    const userIds = users.map((u) => u.id);

    // 3) Ambil incomes yang berkaitan (member OR user) pada tahun yang diminta
    const dateFrom = new Date(`${year}-01-01T00:00:00.000Z`);
    const dateTo = new Date(`${year}-12-31T23:59:59.999Z`);

    let incomes = [];
    // bila tidak ada member & user, skip query (tidak ada income untuk RT ini)
    if (memberIds.length > 0 || userIds.length > 0) {
      const orConditions = [];
      if (memberIds.length > 0)
        orConditions.push({ memberId: { in: memberIds } });
      if (userIds.length > 0) orConditions.push({ userId: { in: userIds } });

      incomes = await prisma.income.findMany({
        where: {
          date: { gte: dateFrom, lte: dateTo },
          OR: orConditions,
        },
        select: {
          amount: true,
          date: true,
        },
        orderBy: { date: "asc" },
      });
    }

    // 4) Kelompokkan berdasarkan tanggal (YYYY-MM-DD) dan jumlahkan
    const dailyMap = {};
    for (const inc of incomes) {
      const dateKey = inc.date.toISOString().split("T")[0]; // "2025-02-28"
      if (!dailyMap[dateKey]) dailyMap[dateKey] = 0;
      dailyMap[dateKey] += inc.amount;
    }

    const dailyTotals = Object.entries(dailyMap)
      .map(([date, totalIncome]) => ({ date, totalIncome }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // 5) Response
    return res.status(200).json({
      rt: rt.name,
      rtId: rt.id,
      year,
      dailyTotals,
    });
  } catch (error) {
    console.error("getTotalIncome error:", error);
    return res.status(500).json({
      status: "failed",
      msg: "internal server error",
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
