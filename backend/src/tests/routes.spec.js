const request = require("supertest");
const app = require("../index");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const statusConstants = require("../../prisma/seed");

describe("Tasks routes tests", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("GET /tasks - pending tasks should return ok", async () => {
    const response = await request(app).get("/tasks/pending");
    expect(response.statusCode).toEqual(200);
  });

  it("GET /tasks - done tasks should return ok", async () => {
    const response = await request(app).get("/tasks/done");
    expect(response.statusCode).toEqual(200);
  });

  it("POST /tasks - new tasks should return ok", async () => {
    var data = {
      description: "teste",
      supervisor_name: "supervisor",
      supervisor_email: "user@gmail.com",
    };

    const response = await request(app).post("/tasks").send(data);
    expect(response.statusCode).toEqual(200);
  });

  it("POST /tasks/for_idle_user - 3 new tasks for idle user should return ok", async () => {
    const response = await request(app).post("/tasks/for_idle_user");
    expect(response.statusCode).toEqual(200);
  });

  it("PUT /tasks - update tasks should return ok", async () => {
    const pendingTasks = await request(app).get("/tasks/pending");
    console.log(pendingTasks)
    if (
      pendingTasks.body &&
      pendingTasks.body !== undefined &&
      pendingTasks.body.length > 0
    ) {
      var data = {
        taskId: pendingTasks.body[0].id,
        taskStatus: "done",
      };
      const response = await request(app).put("/tasks").send(data);
      expect(response.statusCode).toEqual(200);
    }
  });
});
