const express = require("express");
require("dotenv").config();
const authRouter = require("./routes/authRouter");
const expenseRouter = require("./routes/expenseRouter");
const incomeRouter = require("./routes/incomeRouter");
const allDataRouter = require("./routes/allDataRouter");
const membersRouter = require("./routes/memberRouter");
const usersRouter = require("./routes/usersRouter");
const roleRouter = require("./routes/roleRouter");
const rtRouter = require("./routes/rtRouter");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",");

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Origin tidak diizinkan oleh CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use("/api", expenseRouter);
app.use("/api", allDataRouter);
app.use("/api", incomeRouter);
app.use("/api", membersRouter);
app.use("/api", usersRouter);
app.use("/api", roleRouter);
app.use("/api", rtRouter);
app.use("/api/auth", authRouter);

app.listen(process.env.PORT, () => {
  console.log(`server running at port ${process.env.PORT}`);
});
