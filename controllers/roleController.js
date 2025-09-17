const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

exports.getAllRoles = async (req, res) => {
  try {
    const allRoles = await prisma.role.findMany({
      where: {
        name: {
          not: "admin",
        },
      },
    });

    return res.status(200).json({
      status: "success",
      allRoles,
    });
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({
      status: "failed",
      msg: "Something went wrong",
    });
  }
};

exports.detailRoles = async (req, res) => {
  const { id } = req.params;

  try {
    const detailRoles = await prisma.role.findUnique({
      where: { id },
    });
    return res.status(200).json({
      status: "success",
      detailRoles,
    });
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({
      status: "failed",
      msg: "Something went wrong",
    });
  }
};
