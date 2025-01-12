const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.authMiddleware = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({
      status: "failed",
      msg: "anda belum login ",
    });
  }
  let decode;
  try {
    decode = await jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return next(
      res.status(401).json({
        error: error.name,
        message: "Token yang dimasukan tidak ada ",
      })
    );
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: decode.id,
    },
  });

  if (!currentUser) {
    return res.status(401).json({
      status: "failed",
      msg: "silahkan login dengan email yang sudah terdaftar",
    });
  }
  req.user = currentUser;
  next();
};

exports.permissionUser = (...roles) => {
  return async (req, res, next) => {
    const rolesId = await prisma.role.findUnique({ where: { id: req.user.roleId } });
    const roleData = rolesId.name;

    if (!roles.includes(roleData)) {
      return next(
        res.status(403).json({
          status: "failed",
          msg: "anda tidak punya akses kesini",
        })
      );
    }
    next();
  };
};
