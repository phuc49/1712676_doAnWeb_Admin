var express = require('express');
var router = express.Router();
var sp = require('../controller/sp.controller');

module.exports = router;

router.get("/", sp.all);

router.get("/sp/:id", sp.singleID);

//router.post("/", sp.allByName);
router.post("/sp/:id", sp.edit);
router.get("/sp-them", sp.them);
router.post("/sp-them", sp.add);

router.get("/sp-xoa/:id", sp.delete);