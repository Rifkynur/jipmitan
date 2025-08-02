const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getIncome = async (req, res) => {
  try {
    const data = await prisma.income.findMany({
      where: {
        deletedAt: null,
      },
    });

    return res.status(200).json({
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

exports.getDetailIncome = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await prisma.income.findUnique({
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

exports.addIncome = async (req, res) => {
  try {
    const { name, amount, date, desc, rt } = req.body;
    const roleUser = await prisma.role.findUnique({
      where: {
        id: req.user.roleId,
      },
    });

    if (roleUser.name != rt && roleUser.name != "admin") {
      return res.status(403).json({
        status: "failed",
        msg: "masukan rt dengan benar",
      });
    }

    const newData = await prisma.income.create({
      data: {
        name,
        amount,
        rt,
        desc,
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
    const { name, amount, date, desc, rt } = req.body;
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
    });

    if (!findIncome) {
      return res.status(404).json({
        status: "failed",
        msg: "data tidak ditemukan",
      });
    }

    if (roleUser.name != rt && roleUser.name != "admin") {
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
        name,
        amount,
        desc,
        date: new Date(date),
        rt,
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

    if (roleUser.name != findIncome.rt && roleUser.name != "admin") {
      return res.status(401).json({
        status: "failed",
        msh: "anda tidak punya akses kesini",
      });
    }

    const deletedIncome = await prisma.income.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(Date.now()),
      },
    });

    return res.status(201).json({
      status: "success",
      deletedIncome,
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      status: "failed",
      msg: "internal server error",
    });
  }
};
