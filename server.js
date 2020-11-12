const express = require("express");

const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

const exercisesRouter = require("./routes/exercises.js");
const usersRouter = require("./routes/user.js");
const adminsRouter = require("./routes/admin.js");
const toDosRouter = require("./routes/toDo.js");
const chatsRouter = require("./routes/chat.js");
const exhibitorsRouter = require("./routes/exhibitor.js");
const exhibitionsRouter = require("./routes/exhibition");
const ticketsRouter = require("./routes/ticket.js");
const meetingsRouter = require("./routes/meetings");

app.use("/exercises", exercisesRouter);
app.use("/users", usersRouter);
app.use("/admins", adminsRouter);
app.use("/toDos", toDosRouter);
app.use("/tickets", ticketsRouter);
app.use("/chats", chatsRouter);
app.use("/exhibitors", exhibitorsRouter);
app.use("/exhibitions", exhibitionsRouter);
app.use("/meetings", meetingsRouter);

app.listen(port, () => {
  console.log(`Server is running on port: localhost:${port}`);
});
