var express = require('express');
var router = express.Router();
var sp = require('../controller/sp.controller');

module.exports = router;

router.get("/", sp.all);

router.get("/product/:id", sp.singleID);
router.post("/product/:id", sp.edit);

router.get("/add", sp.them);
router.post("/add", sp.add);

router.get("/delete/:id", sp.delete);