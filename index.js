require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");
const config = require("config");
const error = require("./middlewares/error");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const express = require("express");

const app = express();
var cors = require("cors");
app.use(cors());

const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const customer_movies = require("./routes/customer_movies");
const auth = require("./routes/auth");
const helmet = require("helmet");
const compression = require("compression");

//winston.add(new winston.transports.File(), { filename: "logfile.log" });
winston.add(
  new winston.transports.File({ filename: "logfile.log", level: "error" })
);

winston.add(
  new winston.transports.MongoDB({
    //db: "mongodb://localhost:/vidly",
    db: "mongodb://omg:omg@cluster0-shard-00-00.yfmpt.mongodb.net:27017,cluster0-shard-00-01.yfmpt.mongodb.net:27017,cluster0-shard-00-02.yfmpt.mongodb.net:27017/vidly?ssl=true&replicaSet=atlas-3l3xds-shard-0&authSource=admin&retryWrites=true&w=majority",
  })
);

if (!config.get("jwtPrivateKey")) {
  console.error("Fatal Error: jwtPrivateKey is not defined");
  process.exit(1);
}
// .connect("mongodb+srv://omg9800:jagat.786@cluster0.ak8qt.mongodb.net/vidly")
// .connect("mongodb://localhost:/vidly")
// .connect("mongodb://localhost:/vidly")
mongoose
  .connect(
    "mongodb://omg:omg@cluster0-shard-00-00.yfmpt.mongodb.net:27017,cluster0-shard-00-01.yfmpt.mongodb.net:27017,cluster0-shard-00-02.yfmpt.mongodb.net:27017/vidly?ssl=true&replicaSet=atlas-3l3xds-shard-0&authSource=admin&retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to mongodb..."))
  .catch((err) => console.log("Could not connect to mongodb"));

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/customer_movies", customer_movies);
app.use(error);
app.use(helmet());
app.use(compression());

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}...`));
