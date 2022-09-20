const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT;
const { routes } = require("./routes/index");
const path = require("path");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend/build")));
console.log(path.join(__dirname, "..", "frontend/build"));

// express settings
app.use(
    cors({
        origin: "*", // make it public, we might wanna restrict this later
    })
);

// Add all the routes to our Express server
// exported from routes/index.js
routes.forEach((route) => {
    app.use(route.path, route.handler);
});

// serve the frontend
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend/build/index.html"));
});

app.listen(port, () => {
    console.log(`backend listening on port ${port}`);
});
