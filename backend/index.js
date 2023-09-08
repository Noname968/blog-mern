const express = require("express");
require("dotenv").config;
const cors = require("cors");
const mongofun = require("./db");
const cookieparser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieparser());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
mongofun();

// middleware
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.get("/",(req,res)=>{
  res.json("Hello")
})

// routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/post", require("./routes/posts"));
app.use("/api/comment", require("./routes/comments"));
app.use("/api/favorite", require("./routes/favorites"));

// listen
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
