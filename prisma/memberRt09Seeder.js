const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const main = async () => {
  const rt09 = await prisma.rt.findFirst({
    where: {
      name: "09",
    },
  });
  const roles = await prisma.role.findFirst({
    where: {
      name,
    },
  });
  const statusMemberActive = await prisma.status_member.findFirst({
    where: {
      name: "active",
    },
  });

  const memberData = [
    {
      name: "pak yuli",
      rtId: rt09.id,
      status_memberId: statusMemberActive.id,
    },
    {
      name: "pak suwarno",
      rtId: rt09.id,
      status_memberId: statusMemberActive.id,
    },
    {
      name: "pak ribut",
      rtId: rt09.id,
      status_memberId: statusMemberActive.id,
    },
    {
      name: "pak sumarsono",
      rtId: rt09.id,
      status_memberId: statusMemberActive.id,
    },
    {
      name: "pak narto",
      rtId: rt09.id,
      status_memberId: statusMemberActive.id,
    },
    {
      name: "ibu sarni",
      rtId: rt09.id,
      status_memberId: statusMemberActive.id,
    },
    {
      name: "ibu sri",
      rtId: rt09.id,
      status_memberId: statusMemberActive.id,
    },
    {
      name: "pak giyarto",
      rtId: rt09.id,
      status_memberId: statusMemberActive.id,
    },
    {
      name: "pak giyo",
      rtId: rt09.id,
      status_memberId: statusMemberActive.id,
    },
    {
      name: "pak hardiman",
      rtId: rt09.id,
      status_memberId: statusMemberActive.id,
    },
    {
      name: "ibu watiyem",
      rtId: rt09.id,
      status_memberId: statusMemberActive.idstatusMemberActive.id,
    },
    {
      name: "ibu win",
      rtId: rt09.id,
      status_memberId: statusMemberActive.idstatusMemberActive.id,
    },
    {
      name: "pak mulyono",
      rtId: rt09.id,
      status_memberId: statusMemberActive.idstatusMemberActive.id,
    },
    {
      name: "pak haryadi",
      rtId: rt09.id,
      status_memberId: statusMemberActive.idstatusMemberActive.id,
    },
    {
      name: "pak bowo",
      rtId: rt09.id,
      status_memberId: statusMemberActive.idstatusMemberActive.id,
    },
    {
      name: "pak jono",
      rtId: rt09.id,
      status_memberId: statusMemberActive.idstatusMemberActive.id,
    },
    {
      name: "pak hardi",
      rtId: rt09.id,
      status_memberId: statusMemberActive.idstatusMemberActive.id,
    },
    {
      name: "ibu wahini",
      rtId: rt09.id,
      status_memberId: statusMemberActive.id,
    },
    {
      name: "pak tarno",
      rtId: rt09.id,
      status_memberId: statusMemberActive.id,
    },
    {
      name: "pak slamet",
      rtId: rt09.id,
      status_memberId: statusMemberActive.id,
    },
    {
      name: "pak widoyo",
      rtId: rt09.id,
      status_memberId: statusMemberActive.id,
    },
    {
      name: "pak yardi",
      rtId: rt09.id,
      status_memberId: statusMemberActive.id,
    },
    {
      name: "pak giman",
      rtId: rt09.id,
      status_memberId: statusMemberActive.id,
    },
    {
      name: "mas dawud",
      rtId: rt09.id,
      status_memberId: statusMemberActive.id,
    },
    {
      name: "pak harno",
      rtId: rt09.id,
      status_memberId: statusMemberActive.id,
    },
    {
      name: "pak eko",
      rtId: rt09.id,
      status_memberId: statusMemberActive.id,
    },
    {
      name: "pak markuat",
      rtId: rt09.id,
      status_memberId: statusMemberActive.id,
    },
    {
      name: "pak pario",
      rtId: rt09.id,
      status_memberId: statusMemberActive.id,
    },
    {
      name: "pak warto",
      rtId: rt09.id,
      status_memberId: statusMemberActive.id,
    },
    {
      name: "pak marwoto",
      rtId: rt09.id,
      status_memberId: statusMemberActive.id,
    },
    {
      name: "mas dadik",
      rtId: rt09.id,
      status_memberId: statusMemberActive.id,
    },
    {
      name: "pak yamto",
      rtId: rt09.id,
      status_memberId: statusMemberActive.id,
    },
    {
      name: "pak supatno",
      rtId: rt09.id,
      status_memberId: statusMemberActive.id,
    },
    {
      name: "pak rohani",
      rtId: rt09.id,
      status_memberId: statusMemberActive.id,
    },
    {
      name: "pak patmo",
      rtId: rt09.id,
      status_memberId: statusMemberActive.id,
    },
    {
      name: "pak harso",
      rtId: rt09.id,
      status_memberId: statusMemberActive.id,
    },
    {
      name: "pak sigit",
      rtId: rt09.id,
      status_memberId: statusMemberActive.id,
    },
    {
      name: "bakso",
      rtId: rt09.id,
      status_memberId: statusMemberActive.id,
    },
  ];
  const createMember = await prisma.member.createMany({
    data: memberData,
    skipDuplicates: true,
  });
};

main();
