const db = require("./db.js");

module.exports = {
  all: () => db.load("SELECT * FROM category "),
  findByName: (name) => db.load(`SELECT * FROM category WHERE name = ${name}`),
};
