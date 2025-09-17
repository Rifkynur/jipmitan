const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllMembers = async (req, res) => {
  console.log(req.user);

  try {
    let { page = 1, limit = 10, search = "", rt, status } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const where = {};

    // Filter nama member
    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }

    // Filter berdasarkan RT (cek dulu apakah ada di DB)
    if (rt) {
      const rtExists = await prisma.rt.findUnique({
        where: { id: rt },
      });

      if (!rtExists) {
        return res.status(200).json({
          data: [],
          status: "success",
          page,
          totalData: 0,
          totalPage: 0,
        });
      }

      where.rt = {
        is: { id: rt },
      };
    }

    // Filter berdasarkan Status_member (cek dulu apakah ada di DB)
    if (status) {
      const statusExists = await prisma.status_member.findUnique({
        where: { id: status },
      });

      if (!statusExists) {
        return res.status(200).json({
          data: [],
          status: "success",
          page,
          totalData: 0,
          totalPage: 0,
        });
      }

      where.Status_member = {
        is: { id: status },
      };
    }

    // Hitung total data sesuai filter
    const totalData = await prisma.member.count({ where });
    const totalPage = Math.ceil(totalData / limit);

    // Ambil data member sesuai filter dan pagination
    const members = await prisma.member.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: "asc" },
      include: {
        rt: true,
        Status_member: true,
      },
    });

    res.status(200).json({
      data: members,
      status: "success",
      page,
      totalData,
      totalPage,
    });
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({
      status: "failed",
      msg: "Something went wrong",
    });
  }
};

exports.getDetialsMembers = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await prisma.member.findUnique({
      where: { id },
      include: { rt: true, Status_member: true },
    });

    return res.status(200).json({
      status: "success",
      data,
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      status: "failed",
      msg: "internal server error",
    });
  }
};

exports.addMembers = async (req, res) => {
  const user = req.user;
  const { name, rtId } = req.body;
  //   console.log({ roleUser });

  const rtUser = await prisma.rt.findFirst({
    where: { id: user.rtId },
  });
  const rtInput = await prisma.rt.findFirst({
    where: { id: rtId },
  });

  const activeStatus = await prisma.status_member.findFirst({
    where: { name: "active" },
  });

  if (!name || !rtId) {
    return res.status(400).json({
      status: "failed",
      msg: "please insert name or rt",
    });
  }

  if (rtUser.name !== "all" && rtUser.name !== rtInput.name) {
    return res.status(403).json({
      status: "failed",
      msg: "anda tidak punya akses kesini",
    });
  }

  try {
    const newData = await prisma.member.create({
      data: {
        name,
        status_memberId: activeStatus.id,
        rtId,
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

exports.editMembers = async (req, res) => {
  const { id } = req.params;
  const { rtId } = req.body;

  const rtUser = await prisma.rt.findFirst({
    where: { id: req.user.rtId },
  });
  const rtInput = await prisma.rt.findFirst({
    where: { id: rtId },
  });

  if (rtUser.name !== "all" && rtUser.name !== rtInput.name) {
    return res.status(403).json({
      status: "failed",
      msg: "anda tidak punya akses kesini",
    });
  }

  try {
    const memberExist = await prisma.member.findUnique({ where: { id } });
    if (!memberExist) {
      return res
        .status(404)
        .json({ status: "failed", msg: "Member tidak ditemukan" });
    }

    // Update data member
    const updatedMember = await prisma.member.update({
      where: { id },
      data: req.body,
      include: {
        rt: true,
        Status_member: true,
      },
    });

    res.status(200).json({
      status: "success",
      data: updatedMember,
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      status: "failed",
      msg: "internal server error",
    });
  }
};

exports.deleteMember = async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const { name, rtId } = req.body;
  //   console.log({ roleUser });

  const rtUser = await prisma.rt.findFirst({
    where: { id: user.rtId },
  });
  const rtInput = await prisma.rt.findFirst({
    where: { id: rtId },
  });

  if (rtUser.name !== "all" && rtUser.name !== rtInput.name) {
    return res.status(403).json({
      status: "failed",
      msg: "anda tidak punya akses kesini",
    });
  }

  try {
    const memberExist = await prisma.member.findUnique({ where: { id } });
    if (!memberExist) {
      return res.status(404).json({
        status: "failed",
        msg: "Member tidak ditemukan",
      });
    }
    await prisma.member.delete({ where: { id } });

    res.status(200).json({
      status: "success",
      msg: "Member berhasil dihapus",
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      status: "failed",
      msg: "internal server error",
    });
  }
};
