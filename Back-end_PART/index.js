const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const helmet = require("helmet");
const Routes = require("./routers");
const { connectDB } = require("./config/database");
const PORT = 5000;
const app = express();

/* Middlewares*/
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());
app.use("/uploads", express.static("uploads"));
/* Router*/
app.use("/", Routes);
app.use("*", (req, res) => {
  return res.json({
    message: "Page not found !",
    success: false,
  });
});

/*Server and DB */
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server Running In The Port : ${PORT}`);
  });
});
