const express = require("express");
const router = express.Router();
const { hello } = require("../controllers/indexController");

router.get("/", hello);
module.exports = router;
