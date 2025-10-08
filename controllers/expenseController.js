const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getExpense = async (req, res) => {
  let { year = new Date().getFullYear(), page = 1, limit = 10 } = req.query;

  page = parseInt(page);
  try {
    const where = {
      ...(year &&
        year !== "all" && {
          date: {
            gte: new Date(`${year}-01-01`),
            lte: new Date(`${year}-12-31`),
          },
        }),
    };
    const totalData = await prisma.expense.count({ where });
    const totalPage = Math.ceil(totalData / limit);
    const data = await prisma.expense.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
    });
    res.status(200).json({
      status: "success",
      data,
      page,
      totalPage,
      totalData,
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
      msg: "something wrong",
    });
  }
};

exports.getDetailExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await prisma.expense.findUnique({
      where: {
        id,
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
exports.addExpense = async (req, res) => {
  const { amount, date, desc } = req.body;
  const user = req.user;

  try {
    const newData = await prisma.expense.create({
      data: {
        amount,
        date: new Date(date),
        desc,
        userId: user.id,
      },
    });

    return res.status(201).json({
      status: "success",
      data: newData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      msg: "internal server error",
    });
  }
};

exports.updateExpense = async (req, res) => {
  const { id } = req.params;
  const { date, desc, amount } = req.body;
  try {
    const findExpeseById = await prisma.expense.findUnique({
      where: {
        id,
      },
    });
    if (!findExpeseById) {
      return res.status(404).json({
        status: "failed",
        msg: "data tidak ditemukan",
      });
    }
    const updateExpense = await prisma.expense.update({
      where: {
        id,
      },
      data: {
        date: new Date(date),
        desc,
        amount,
        updatedAt: new Date(Date.now()),
      },
    });

    return res.status(201).json({
      status: "success",
      data: updateExpense,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      status: "failed",
      msg: "internal server error",
    });
  }
};

exports.deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    const findExpense = await prisma.expense.findUnique({
      where: {
        id,
      },
    });

    if (!findExpense) {
      return res.status(404).json({
        status: "failed",
        msg: "data tidak ditemukan",
      });
    }

    const deletedExpense = await prisma.expense.delete({
      where: {
        id,
      },
    });

    return res.status(201).json({
      status: "success",
      msg: "Berhasil Menghapus Data",
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      msg: "internal server error ",
    });
  }
};
