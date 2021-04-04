const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const PENDING_ID = 1;
const DONE_ID = 2;

async function main() {
  await prisma.taskStatuses.upsert({
    where: { id: PENDING_ID },
    update: {},
    create: {
      description: "pending",
    },
  });

  await prisma.taskStatuses.upsert({
    where: { id: DONE_ID },
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
  
  module.exports = Object.freeze({
    PENDING_ID,
    DONE_ID
});
