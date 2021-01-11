const mysql = require("mysql");
const util = require('util');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    connectionLimit: process.env.connectionLimit
});

const mysql_query = util.promisify(pool.query).bind(pool);
module.exports = {
    load: mysql_query,
    add: (tableName, entity) => mysql_query(`INSERT INTO ${tableName} SET ? `, entity) ,
    del: (tableName, condition) => mysql_query(`DELETE FROM ${tableName} WHERE ?`, condition),
    edit: (tableName, entity, condition) => mysql_query(`UPDATE ${tableName} SET ? WHERE ?`, [entity, condition])
};

