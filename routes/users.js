var express = require('express');
var router = express.Router();
var users = require('../controller/users.controller');

/* GET users listing. */
router.get('/', users.all);
router.get('/user/:id', users.singleID);

module.exports = router;
