express = require("express");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const app = express();

app.use(express.json());

/* 
    Get tasks by status 
*/
app.get("/tasks/:taskStatus", (req, res) => {
  const { taskStatus } = req.params;

  prisma.task
    .findMany({
      where: {
        status: {
          description: taskStatus,
        },
      },
      include: {
        status: { select: { description: true } },
      },
    })
    .then((data) => {
      return res.json([data]);
    })
    .catch((err) => {
      return res.status(400).send({
        message: err["message"] ? err["message"] : "an error ocurred",
      });
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
});

/* 
    Update task status
*/
app.put("/tasks", (req, res) => {
  const { taskId, taskStatus } = req.body;

  prisma.taskStatuses
    .findFirst({ where: { description: taskStatus } })
    .then((status) => {
      if (!status)
        return res.status(400).send({
          message: `There's no such status as '${taskStatus}'`,
        });
      prisma.task
        .update({
          where: {
            id: taskId,
          },
          data: {
            statusId: status.id,
          },
        })
        .then((data) => {
          return res.json([data]);
        });
    })
    .catch((err) => {
      return res.status(400).send({
        message: err["message"] ? err["message"] : "an error ocurred",
      });
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
});

app.listen(3000);
