const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const main = async () => {
  const rt = await prisma.rt.findMany();
  const roles = await prisma.role.findMany();
  const statusMember = await prisma.status_member.findMany();

  const memberData = [
    {
      name: "pak yuli",
      rtId: rt[0].id,
      status_memberId: statusMember[0].id,
    },
    {
      name: "pak suwarno",
      rtId: rt[0].id,
      status_memberId: statusMember[0].id,
    },
    {
      name: "pak ribut",
      rtId: rt[0].id,
      status_memberId: statusMember[0].id,
    },
    {
      name: "pak sumarsono",
      rtId: rt[0].id,
      status_memberId: statusMember[0].id,
    },
    {
      name: "pak narto",
      rtId: rt[0].id,
      status_memberId: statusMember[0].id,
    },
    {
      name: "ibu sarni",
      rtId: rt[0].id,
      status_memberId: statusMember[0].id,
    },
    {
      name: "ibu sri",
      rtId: rt[0].id,
      status_memberId: statusMember[0].id,
    },
    {
      name: "pak giyarto",
      rtId: rt[0].id,
      status_memberId: statusMember[0].id,
    },
    {
      name: "pak giyo",
      rtId: rt[0].id,
      status_memberId: statusMember[0].id,
    },
    {
      name: "pak hardiman",
      rtId: rt[0].id,
      status_memberId: statusMember[0].id,
    },
    {
      name: "ibu watiyem",
      rtId: rt[0].id,
      status_memberId: statusMember[0].id,
    },
    {
      name: "ibu win",
      rtId: rt[0].id,
      status_memberId: statusMember[0].id,
    },
    {
      name: "pak mulyono",
      rtId: rt[0].id,
      status_memberId: statusMember[0].id,
    },
    {
      name: "pak haryadi",
      rtId: rt[0].id,
      status_memberId: statusMember[0].id,
    },
    {
      name: "pak bowo",
      rtId: rt[0].id,
      status_memberId: statusMember[0].id,
    },
    {
      name: "pak jono",
      rtId: rt[0].id,
      status_memberId: statusMember[0].id,
    },
    {
      name: "pak hardi",
      rtId: rt[0].id,
      status_memberId: statusMember[0].id,
    },
    {
      name: "ibu wahini",
      rtId: rt[0].id,
      status_memberId: statusMember[0].id,
    },
    {
      name: "pak tarno",
      rtId: rt[0].id,
      status_memberId: statusMember[0].id,
    },
    {
      name: "pak slamet",
      rtId: rt[0].id,
      status_memberId: statusMember[0].id,
    },
    {
      name: "pak widoyo",
      rtId: rt[0].id,
      status_memberId: statusMember[0].id,
    },
    {
      name: "pak yardi",
      rtId: rt[0].id,
      status_memberId: statusMember[0].id,
    },
    {
      name: "pak giman",
      rtId: rt[0].id,
      status_memberId: statusMember[0].id,
    },
    {
      name: "mas dawud",
      rtId: rt[0].id,
      status_memberId: statusMember[0].id,
    },
    {
      name: "pak harno",
      rtId: rt[0].id,
      status_memberId: statusMember[0].id,
    },
    {
      name: "pak eko",
      rtId: rt[0].id,
      status_memberId: statusMember[0].id,
    },
    {
      name: "pak markuat",
      rtId: rt[0].id,
      status_memberId: statusMember[0].id,
    },
    {
      name: "pak pario",
      rtId: rt[0].id,
      status_memberId: statusMember[0].id,
    },
    {
      name: "pak warto",
      rtId: rt[0].id,
      status_memberId: statusMember[0].id,
    },
    {
      name: "pak marwoto",
      rtId: rt[0].id,
      status_memberId: statusMember[0].id,
    },
    {
      name: "mas dadik",
      rtId: rt[0].id,
      status_memberId: statusMember[0].id,
    },
    {
      name: "pak yamto",
      rtId: rt[0].id,
      status_memberId: statusMember[0].id,
    },
    {
      name: "pak supatno",
      rtId: rt[0].id,
      status_memberId: statusMember[0].id,
    },
    {
      name: "pak rohani",
      rtId: rt[0].id,
      status_memberId: statusMember[0].id,
    },
    {
      name: "pak patmo",
      rtId: rt[0].id,
      status_memberId: statusMember[0].id,
    },
    {
      name: "pak harso",
      rtId: rt[0].id,
      status_memberId: statusMember[0].id,
    },
    {
      name: "pak sigit",
      rtId: rt[0].id,
      status_memberId: statusMember[0].id,
    },
    {
      name: "bakso",
      rtId: rt[0].id,
      status_memberId: statusMember[1].id,
    },
  ];
  const createMember = await prisma.member.createMany({
    data: memberData,
    skipDuplicates: true,
  });
};

main();
