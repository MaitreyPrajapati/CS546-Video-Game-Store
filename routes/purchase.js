const express = require("express");
const router = express.Router();
const data = require("../data");
const userdata = data.users;
var bodyParser = require("body-parser");

router.get("/", async (req, res) => {
    res.render("pages/purchase");
});

module.exports = router;