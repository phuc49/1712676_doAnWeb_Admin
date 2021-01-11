var express = require('express');
var router = express.Router();
var users = require('../controller/users.controller');

/* GET users listing. */
router.get('/', users.all);
router.get('/user/:id', users.singleID);
router.get('/lock/:id', users.lock);
router.get('/unlock/:id', users.unlock);

module.exports = router;
