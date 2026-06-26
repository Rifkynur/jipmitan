const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const main = async () => {
  const statusMember = [
    {
      name: "active",
    },
    {
      name: "inActive",
    },
  ];

  const createStatusMember = await prisma.status_member.createMany({
    data: statusMember,
    skipDuplicates: true,
  });
};

main();
