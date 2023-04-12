const { initializeApp } = require("firebase-admin/app");
const { FirebaseService } = require("./services/firebase");
const cors = require("cors");

const express = require("express");
const path = require("path");

const app = express();
app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies
app.use(cors());

const port = 3000;
let firebaseService = null;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  FirebaseService.init();
});

app.post("/token", (req, res) => {
  console.log("REGISTER TOKEN:", req.body);

  res.status(201).send('Ok');
});

app.get("/ping", (req, res) => {
  console.log("PONG!");
  res.send("pong");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/form.html"));
});

app.post("/message", async (req, res) => {
  const { target, title, body } = req.body;

  console.log(target, title, body);

  const messageReponse = await FirebaseService.sendNotification({
    target,
    title,
    message: body,
  });

  res.send(`Message sent! ID: ${messageReponse}`);
});
