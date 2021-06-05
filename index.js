const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/user");
const taskRoutes = require("./routes/task");

// Initialising variables
const app = express();
const dbUrl = process.env.DB;

console.log(dbUrl);

// Mongoose connection
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DB is successfully connected");
  })
  .catch((err) => {
    console.log(`Not able to connect to DB, ${err}`);
  });

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/api", userRoutes);
app.use("/api", taskRoutes);

// Port
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server successfully running on port ${port}`);
});
