// const express = require("express");
// const cors = require("cors");
// const http = require("http");
// const { Server } = require("socket.io");

// const dotenv = require("dotenv");
// const mongoose = require("mongoose");
// const authRoute = require("./routes/auth");
// const sampleRoute = require("./routes/sample");

// const app = express();
// app.use(express.json());
// app.use(
//   cors({
//     credentials: true,
//     origin: "http://localhost:5173",
//     exposedHeaders: ["set-cookies"],
//   })
// );

// const server = http.createServer(app);

// dotenv.config();

// const PORT = process.env.PORT || 6969;
// const MONGO_URL = process.env.MONGODB_URL;

// //connect database
// mongoose
//   .connect(MONGO_URL)
//   .then(console.log("connect to Mongoose"))
//   .catch((err) => console.log(err));

// app.listen(PORT, () => {
//   console.log("connect to port " + PORT);
// });

// app.all("/", function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   next();
// });

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log("connect");
// });

// app.use("/api/auth", authRoute);
// app.use("/api/create-sample", sampleRoute);

const express = require("express");
const cors = require("cors");

const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const sampleRoute = require("./routes/sample");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    exposedHeaders: ["set-cookies"],
  })
);
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const PORT = process.env.PORT || 6969;
const MONGO_URL = process.env.MONGODB_URL;

//connect database
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("Connected to Mongoose"))
  .catch((err) => console.log(err));

// Tạo máy chủ HTTP bằng http.createServer
const server = http.createServer(app);

// Xóa dòng này vì bạn sẽ sử dụng server đã tạo cho socket.io
// app.listen(PORT, () => {
//   console.log("Connect to port " + PORT);
// });

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("loading-server", (data) => {
    socket.broadcast.emit("loading-client", data);
  });
});

app.all("/", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.use("/api/auth", authRoute);
app.use("/api/create-sample", sampleRoute);

// Listen trên máy chủ HTTP
server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
