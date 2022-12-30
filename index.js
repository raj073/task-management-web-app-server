const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mlxaon5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const addTaskCollection = client.db("taskManagement").collection("addTask");

    //Add Task API
    app.post("/addTask", async (req, res) => {
      const task = req.body;
      console.log(task);
      const result = await addTaskCollection.insertOne(task);
      res.send(result);
    });

    //Get Task by Email
    app.get("/mytask", async (req, res) => {
      //const email = req.query.email;
      const query = {};
      const mytask = await addTaskCollection.find(query).toArray();
      res.send(mytask);
    });

    //Task Delete API
    app.delete("/task/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await addTaskCollection.deleteOne(filter);
      res.send(result);
    });

    //Get Id Wise Task API
    app.get("/mytask/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const task = await addTaskCollection.find(query).toArray();
      res.send(task);
    });

    //Get Id Wise Task Details for Private API
    app.get("/taskdetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const task = await addTaskCollection.find(query).toArray();
      res.send(task);
    });

    //update A Task from MyTask
    app.patch("/mytask/:id", async (req, res) => {
      const id = req.params.id;
      const updatedTask = req.body;
      const query = { _id: ObjectId(id) };
      const updatedDoc = {
        $set: {
          taskName: updatedTask.taskName,
          taskDetails: updatedTask.taskDetails,
          taskPriority: updatedTask.taskPriority,
          image: updatedTask.image,
          assingedTime: updatedTask.assingedTime,
        },
      };
      const result = await addTaskCollection.updateOne(query, updatedDoc);
      res.send(result);
    });

    //Get Complete task from Database
    app.get("/complete-task", async (req, res) => {
      const id = req.params.id;
      const filter = { taskStatus: "Completed" };
      const completeTask = await addTaskCollection.find(filter).toArray();
      res.send(completeTask);
    });

    //.Update complete Task and Taskdetails Component to Make taskStatus Complete to Not Completed
    app.put("/complete-task/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const notCompleteTask = {
        $set: {
          taskStatus: "Not Completed",
        },
      };
      const result = await addTaskCollection.updateOne(
        filter,
        notCompleteTask,
        options
      );
      res.send(result);
    });

    //Update Mytask and TaskDetails Component button Not Completed Status to Completed Status
    app.put("/mytask/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: ObjectId(id) };
      console.log(filter);
      const options = { upsert: true };
      const updatedCompletedStatus = {
        $set: {
          taskStatus: "Completed",
        },
      };
      const result = await addTaskCollection.updateOne(
        filter,
        updatedCompletedStatus,
        options
      );
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.log);

app.get("/", async (req, res) => {
  res.send("Task Management System Server is Running");
});

app.listen(port, () => {
  console.log(`Task Management System Server is Running on ${port}`);
});
