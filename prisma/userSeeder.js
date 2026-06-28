const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

const main = async () => {
  const adminRt = await prisma.rt.findFirst({
    where: {
      name: "all",
    },
  });
  const rt09 = await prisma.rt.findFirst({
    where: {
      name: "09",
    },
  });
  const adminRole = await prisma.role.findFirst({
    where: {
      name: "admin",
    },
  });
  const rt09Role = await prisma.role.findFirst({
    where: {
      name: "09",
    },
  });

  const hashPassword = await bcrypt.hash("pass123", 10);

  const usersData = [
    {
      username: "admin",
      password: hashPassword,
      roleId: adminRole.id,
      rtId: adminRt.id,
    },
    {
      username: "member09",
      password: hashPassword,
      roleId: rt09Role.id,
      rtId: rt09.id,
    },
  ];

  const createUser = await prisma.user.createMany({
    data: usersData,
    skipDuplicates: true,
  });

  // const deleteUsers = await prisma.user.deleteMany();

  console.log(`${createUser.count} user berhasil dibuat`);
};

main();
