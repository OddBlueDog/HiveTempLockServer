require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const temperatureMonitor = require("./temperatureMonitor");

const usersController = require("./controllers/UserController");

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/api/user/", usersController.insert);
app.delete("/api/user/", usersController.delete);

app.listen(8012);
