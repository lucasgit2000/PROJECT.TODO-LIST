express = require("express");

const axios = require("axios");
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
    Create task 
*/
app.post("/tasks", (req, res) => {
  const { description, supervisor_name, supervisor_email } = req.body;

  if (!supervisor_email)
    return res.status(400).send({
      message: "please, make sure you have provided a valid supervisor email",
    });

  axios
    .get("http://apilayer.net/api/check", {
      params: {
        access_key: 12345,
        email: supervisor_email,
      },
    })
    .then((response) => {
      if (!response.format_valid) {
        const messageResponse =
          !response.did_you_mean || response.did_you_mean === ""
            ? `email format invalid, please try again`
            : `email format invalid, didn't you mean ${response.did_you_mean}?`;

        return res.status(400).send({
          message: messageResponse,
        });
      }
      prisma.task.create({
        data: {
          description,
          supervisor_name,
          supervisor_email,
        },
      });
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
    Create tasks for idle user
*/
app.post("/tasks/many/:quantity", (req, res) => {
  const { quantity } = req.params;

  const tasksToBeCreated = new Array(quantity);

  for (let index = 0; index < tasksToBeCreated.length; index++) {
    const randomDogFacts = ""; //TODO: ALEX WOHL BRUCK API
    tasksToBeCreated[index] = { description: randomDogFacts };
  }

  prisma.task
    .createMany({
      data: tasksToBeCreated,
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

    ps: password only required if task was updated to pending more than twice
*/
app.put("/tasks", (req, res) => {
  const { taskId, taskStatus, password } = req.body;

  prisma.taskStatuses
    .findFirst({ where: { description: taskStatus } })
    .then((status) => {
      if (!status)
        return res.status(400).send({
          message: `There's no such status as '${taskStatus}'`,
        });

      prisma.task.findFirst().then((data) => {
        if (!data)
          return res.status(400).send({
            message: "task doesn't exist",
          });

        if (data.timesUpdatedToPending > 2)
          return res.status(400).send({
            message: "task reached the pending status update limit",
          });

        if (taskStatus === "pending" && password !== "TrabalheNaSaipos")
          return res.status(400).send({
            message: "incorrect password",
          });

        prisma.task
          .update({
            where: {
              id: taskId,
            },
            data: {
              statusId: status.id,
              timesUpdatedToPending:
                taskStatus === "pending"
                  ? data.timesUpdatedToPending + 1
                  : data.timesUpdatedToPending,
            },
          })
          .then((data) => {
            return res.json([data]);
          });
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
