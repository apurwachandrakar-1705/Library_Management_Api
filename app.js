require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const port = process.env.PORT;
const api = process.env.API_URL
const bookRouter = require("./routes/books")
const userRouter = require("./routes/users")


// MIDDLEWARE
app.use(bodyParser.json());
app.use(morgan("tiny"));

//  ROUTES
app.use(`${api}/books`,bookRouter)
app.use(`${api}/users`,userRouter)
// CONNECTION WITH DB.........
mongoose
  .connect(process.env.mongoURL)
  .then(() => console.log("connected with db..."))
  .catch((err) => console.log(err));

app.listen(port, () => console.log(`server is running on port ${port}`));
