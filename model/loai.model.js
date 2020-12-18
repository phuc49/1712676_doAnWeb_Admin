const db = require("./db.js");

module.exports = {
    all: () =>
      db.load("SELECT * FROM loai_sp ")
    
};