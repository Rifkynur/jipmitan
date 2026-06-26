const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const rtData = [
  { name: "09" },
  { name: "10" },
  { name: "11" },
  { name: "all" },
];

const main = async () => {
  try {
    console.log("🌱 Seeding RT data...");

    for (const rt of rtData) {
      // Cek apakah RT sudah ada
      const existingRT = await prisma.rt.findUnique({
        where: { name: rt.name },
      });

      if (existingRT) {
        console.log(`⚠️  RT ${rt.name} sudah ada, dilewati`);
      } else {
        // Create RT baru
        await prisma.rt.create({
          data: {
            name: rt.name,
          },
        });
        console.log(`✅ RT ${rt.name} berhasil dibuat`);
      }
    }

    console.log("✨ Seeding RT selesai!");
  } catch (error) {
    console.error("❌ Error saat seeding RT:", error);
  } finally {
    await prisma.$disconnect();
  }
};

main();
