const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    data: "bisaa",
  });
});

app.listen(process.env.PORT, () => {
  console.log(`server running at port ${process.env.PORT}`);
});
