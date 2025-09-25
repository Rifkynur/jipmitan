const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

exports.getAllUsers = async (req, res) => {
  const adminId = await prisma.role.findUnique({
    where: { name: "admin" },
  });
  try {
    const allUsers = await prisma.user.findMany({
      where: {
        roleId: {
          not: adminId.id,
        },
      },

      select: {
        password: false,
        username: true,
        roleId: true,
        id: true,
        rtId: true,
        role: {
          select: { name: true },
        },
        rt: { select: { name: true } },
      },
    });
    res.status(200).json({
      status: "success",
      allUsers,
    });
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({
      status: "failed",
      msg: "Something went wrong",
    });
  }
};

exports.addUsers = async (req, res) => {
  const { username, password, rtId } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);

  const user = req.user;

  const roleUserLogin = await prisma.role.findFirst({
    where: {
      id: user.roleId,
    },
  });

  const inputRt = await prisma.rt.findFirst({
    where: {
      id: rtId,
    },
  });

  const inputRole = await prisma.role.findFirst({
    where: {
      name: inputRt.name,
    },
  });
  console.log({ password, rtId, username });

  if (!username || !password || !rtId) {
    return res.status(400).json({
      status: "failed",
      msg: "please insert data",
    });
  }
  if (roleUserLogin.name !== "admin") {
    return res.status(403).json({
      status: "failed",
      msg: "anda tidak punya akses kesini",
    });
  }

  try {
    const newData = await prisma.user.create({
      data: {
        username,
        password: passwordHash,
        roleId: inputRole?.id,
        rtId,
      },
    });
    return res.status(201).json({
      status: "success",
      newData,
    });
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({
      status: "failed",
      msg: "Something went wrong",
    });
  }
};

exports.getDetailUsers = async (req, res) => {
  const { id } = req.params;
  try {
    const detailUsers = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        username: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        rt: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.status(200).json({
      msg: "succes",
      detailUsers,
    });
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({
      status: "failed",
      msg: "Something went wrong",
    });
  }
};

exports.editUsers = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const { username, password, rtId, roleId } = req.body;

  const RoleAdmin = await prisma.role.findUnique({
    where: {
      id: user.roleId,
    },
  });

  if (!RoleAdmin.name) {
    return res.status(404).json({
      status: "failed",
      msg: "Anda Tidak Punya Akses",
    });
  }

  try {
    const existingUsers = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUsers) {
      return res.status(404).json({
        status: "failed",
        msg: "User tidak ditemukan",
      });
    }

    const updatedUsers = await prisma.user.update({
      where: { id },
      data: req.body,
      include: {
        rt: true,
        role: true,
      },
    });

    return res.status(202).json({
      msg: "success",
      updatedUsers,
    });
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({
      status: "failed",
      msg: "Something went wrong",
    });
  }
};

exports.deleteUsers = async (req, res) => {
  const { id } = req.params;

  const existingUsers = await prisma.user.findUnique({ where: { id } });

  if (!existingUsers) {
    return res.status(400).json({
      status: "failed",
      msg: "Data tidak ditemukan",
    });
  }

  try {
    await prisma.user.delete({ where: { id } });

    return res.status(202).json({
      status: "success",
      msg: "Berhasil menghapus data",
    });
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({
      status: "failed",
      msg: "Something went wrong",
    });
  }
};
