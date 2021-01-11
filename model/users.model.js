const db = require("./db.js");
const { buildCondition } = require("../helper/helper.js");

const CUS_TABLE = "customers c JOIN users u ON u.id = c.id";
const AD_TABLE = "admin a JOIN users u ON a.id = u.id";
const TABLE =
  "users u JOIN (select id, name, phone_number, date_of_birth, image from customers UNION  select id, name, phone_number, date_of_birth, image from admin ) a ON u.id = a.id";
const viewFields = [
  "u.id id",
  "name",
  "email",
  "role",
  "status",
  "phone_number",
  "date_of_birth"
];

module.exports = {
  singleID: (id) =>
    db.load(
      `SELECT ${viewFields} , image
                FROM ${TABLE}
                WHERE u.id = ?`,
      id
    ),
  all: (offset, limit, { name, orderBy, category_id }) => {
    let condition = "";
    let params = [];
    if (name) {
      condition = buildCondition(
        condition,
        params,
        ` AND p.name LIKE ?`,
        `%${name}%`
      );
    }

    var order = "u.id ASC";
    if (orderBy == "newest") {
      order = "u.id DESC";
    }

    params.push(offset * limit, limit);

    let tb = TABLE;
    if (category_id == 1) tb = CUS_TABLE;
    else if (category_id == 2) tb = AD_TABLE;

    return db.load(
      `SELECT ${viewFields}
                   FROM ${tb}
                   WHERE 1 = 1 ${condition}
                   ORDER BY ${order} 
                   LIMIT ?,?`,
      params
    );
  },

  count: ({ name, category_id }) => {
    let condition = "";
    let params = [];
    if (name) {
      condition = buildCondition(
        condition,
        params,
        ` AND p.name LIKE ? `,
        `%${name}%`
      );
    }
    let tb = "users";
    if (category_id == 1) tb = "customers";
    else if (category_id == 2) tb = "admin";

    return db.load(
      `SELECT COUNT(id) AS sl 
                   FROM ${tb} WHERE 1=1  ${condition}`,
      params
    );
  },

  edit: (status, id) => db.edit("products", status, { id: id }),
};
