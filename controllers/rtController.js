const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllRt = async (req, res) => {
  try {
    const allRt = await prisma.rt.findMany({
      where: {
        name: { not: "all" },
      },
    });

    return res.status(200).json({
      status: "success",
      allRt,
    });
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({
      status: "failed",
      msg: "Something went wrong",
    });
  }
};

exports.detailRt = async (req, res) => {
  const { id } = req.params;

  try {
    const detailRt = await prisma.rt.findUnique({
      where: { id },
    });

    return res.status(200).json({
      status: "succes",
      detailRt,
    });
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({
      status: "failed",
      msg: "Something went wrong",
    });
  }
};
