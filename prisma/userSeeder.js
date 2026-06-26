const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

const main = async () => {
  const rt = await prisma.rt.findMany();
  const roles = await prisma.role.findMany();

  console.log(rt);
  console.log(roles);

  const hashPassword = await bcrypt.hash("pass123", 10);

  const usersData = [
    {
      username: "admin",
      password: hashPassword,
      roleId: roles[0].id,
      rtId: rt[3].id,
    },
    {
      username: "member09",
      password: hashPassword,
      roleId: roles[1].id,
      rtId: rt[0].id,
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
