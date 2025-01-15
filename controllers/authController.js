const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = async (user, statusCode, res) => {
  const token = signToken(user.id);
  const cookieOption = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "none",
    secure: process.env.NODE_ENV === "production",
  };

  const userData = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
    select: {
      email: true,
      role: {
        select: {
          name: true,
        },
      },
    },
  });
  res.cookie("jwt", token, cookieOption);
  res.status(statusCode).json({
    status: "success",
    userData,
  });
};

exports.loginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(404).json({
      status: "failed",
      msg: "masukan email / password",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        status: "failed",
        msg: "email tidak ditemukan",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(404).json({
        status: "failed",
        msg: "password salah",
      });
    }
    await createSendToken(user, 200, res);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      status: "failed",
      msg: "internal server error",
    });
  } finally {
    await prisma.$disconnect();
  }
};

exports.logoutController = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({
      status: "success",
      msg: "logout berhasil",
    });
  } catch (error) {
    console.log(error);
  }
};
