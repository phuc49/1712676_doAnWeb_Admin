var express = require('express');
var router = express.Router();
var sp = require('../controller/sp.controller');

module.exports = router;

router.get("/", sp.all);
router.get("/:loai_sp", sp.allByCategory);
router.get("/sp/:ma_sp", sp.singleID);

router.post("/", sp.allByName);
router.post("/sp/:ma_sp", sp.edit)
