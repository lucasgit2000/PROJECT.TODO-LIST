express = require("express");

const axios = require("axios");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const statusConstants = require("../prisma/seed");

const app = express();

app.use(express.json());

/* 
    Get tasks by status 
*/
app.get("/tasks/:taskStatus", (req, res) => {
  const { taskStatus } = req.params;
  //TODO: pagination

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
      return res.json(data);
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

    ps: default status pending
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
        access_key: "f20f7ae318c34b92ee6a685fac758feb",
        email: supervisor_email,
      },
    })
    .then((response) => {
      if (!response.data.format_valid || response.data.did_you_mean !== "") {
        const messageResponse =
          response.data.did_you_mean === ""
            ? `email format invalid, please check the spelling and try again`
            : `email format invalid, didn't you mean ${response.data.did_you_mean}?`;

        return res.status(400).send({
          message: messageResponse,
        });
      }

      prisma.task
        .create({
          data: {
            description,
            supervisor_name,
            supervisor_email,
            statusId: statusConstants.PENDING_ID,
          },
        })
        .then((data) => {
          return res.json(data);
        })
        .catch((err) => {
          return res.status(400).send({
            message: err["message"] ? err["message"] : "an error ocurred",
          });
        })
        .finally(async () => {
          await prisma.$disconnect();
        });
    })
    .catch((err) => {
      return res.status(400).send({
        message: err["message"] ? err["message"] : "an error ocurred",
      });
    });
});

/* 
    Create 3 tasks for idle user

    ps: default status pending
*/
app.post("/tasks/for_idle_user", (req, res) => {
  axios
    .get("https://cat-fact.herokuapp.com/facts/random", {
      params: {
        animal_type: "dog",
        amount: 3,
      },
    })
    .then((response) => {
      let tasksToBeCreated = new Array();

      for (let index = 0; index < response.data.length; index++) {
        const dogFact = response.data[index];

        tasksToBeCreated[index] = {
          description: dogFact.text,
          supervisor_name: "Eu",
          supervisor_email: "eu@me.com",
          statusId: statusConstants.PENDING_ID,
        };
      }

      prisma.task
        .createMany({
          data: tasksToBeCreated,
        })
        .then((data) => {
          console.log(data);
          return res.json(data);
        })
        .catch((err) => {
          return res.status(400).send({
            message: err["message"] ? err["message"] : "an error ocurred",
          });
        })
        .finally(async () => {
          await prisma.$disconnect();
        });
    })
    .catch((err) => {
      return res.status(400).send({
        message: err["message"] ? err["message"] : "an error ocurred",
      });
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

      prisma.task
        .findFirst({ where: { id: taskId } })
        .then((data) => {
          console.log(data);
          if (!data)
            return res.status(400).send({
              message: "task doesn't exist",
            });

          if (data.timesUpdatedToPending >= 2)
            return res.status(400).send({
              message: "task reached pending status update limit",
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
              return res.json(data);
            })
            .catch((err) => {
              return res.status(400).send({
                message: err["message"] ? err["message"] : "an error ocurred",
              });
            })
            .finally(async () => {
              await prisma.$disconnect();
            });
        })
        .catch((err) => {
          return res.status(400).send({
            message: err["message"] ? err["message"] : "an error ocurred",
          });
        });
    })
    .catch((err) => {
      return res.status(400).send({
        message: err["message"] ? err["message"] : "an error ocurred",
      });
    });
});

app.listen(3000);
