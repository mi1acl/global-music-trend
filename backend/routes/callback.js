const express = require("express");
const router = express.Router();
require("dotenv").config();

async function run(req, res) {
    res.status(200).send("OK!");
}

router.get("", (req, res) => run(req, res));

module.exports = {
    path: "/callback", // The main entrance to this route aka /
    handler: router, // The router object that handles this route
};
