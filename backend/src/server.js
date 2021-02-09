const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/users.routes");

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

mongoose.connect(
    process.env.MONGOOSE_CONNECTION_STRING,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    },
    (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("Database Connection Established!");
    }
);

app.use("/users", userRoutes);
// app.use('/todos', require('./routes/todos.routes'))

const server = () => {
    app.listen(PORT, () =>
        console.log(`The server has started on port: ${PORT}`)
    );
};

module.exports = server;
