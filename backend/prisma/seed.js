const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.taskStatuses.upsert({
    where: { id: 1 },
    update: {},
    create: {
      description: "pending",
    },
  });

  await prisma.taskStatuses.upsert({
    where: { id: 2 },
    update: {},
    create: {
      description: "done",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
