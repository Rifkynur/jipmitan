const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getExpense = async (req, res) => {
  try {
    const data = await prisma.expense.findMany({
      where: {
        deletedAt: null,
      },
    });
    res.status(200).json({
      status: "success",
      data,
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
  const { name, amount, date, desc } = req.body;
  try {
    const newData = await prisma.expense.create({
      data: {
        name,
        amount,
        date: new Date(date),
        desc,
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
  const { name, date, desc, amount } = req.body;
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
        name,
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

    const deletedExpense = await prisma.expense.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(Date.now()),
      },
    });

    return res.status(201).json({
      status: "success",
      data: deletedExpense,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      msg: "internal server error ",
    });
  }
};
