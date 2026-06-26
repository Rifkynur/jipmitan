const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const roleData = [
  { name: "admin" },
  { name: "09" },
  { name: "10" },
  { name: "11" },
];

const main = async () => {
  try {
    console.log("🌱 Seeding Role data...");

    for (const role of roleData) {
      // Cek apakah Role sudah ada
      const existingRole = await prisma.role.findUnique({
        where: { name: role.name },
      });

      if (existingRole) {
        console.log(`⚠️  Role ${role.name} sudah ada, dilewati`);
      } else {
        // Create Role baru
        await prisma.role.create({
          data: {
            name: role.name,
          },
        });
        console.log(`✅ Role ${role.name} berhasil dibuat`);
      }
    }

    console.log("✨ Seeding Role selesai!");
  } catch (error) {
    console.error("❌ Error saat seeding Role:", error);
  } finally {
    await prisma.$disconnect();
  }
};

main();
