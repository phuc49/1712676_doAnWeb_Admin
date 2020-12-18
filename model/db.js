const mysql = require("mysql");
const dbConfig = require("../config/db.config");
const util = require('util');

const pool = mysql.createPool({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database
});

const mysql_query = util.promisify(pool.query).bind(pool);
module.exports = {
    load: mysql_query,
    add: (tableName, entity) => mysql_query(`INSERT INTO ${tableName} SET ? `, entity) ,
    del: (tableName, condition) => mysql_query(`DELETE FROM ${tableName} WHERE ?`, condition),
    edit: (tableName, entity, condition) => mysql_query(`UPDATE ${tableName} SET ? WHERE ?`, [entity, condition])
};

