const db = require("./db.js");
const { buildCondition } = require("../helper/helper.js");

const TABLE = "products p JOIN category c ON p.category_id = c.id";
const viewFields = [
  "p.id as product_id",
  "p.name as product_name",
  "p.price",
  "p.inventory_quantity",
  "p.description",
  "p.discount",
  "p.buys",
  "p.image",
  "c.id as category_id",
  "c.name as category_name",
];

module.exports = {
  singleID: (productId) =>
    db.load(`SELECT ${viewFields} 
               FROM ${TABLE}
               WHERE p.id = ${productId} `),
  all: (offset, limit, { name, category_id, orderBy }) => {
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
    condition = buildCondition(
      condition,
      params,
      ` AND category_id = ?`,
      category_id
    );

    var order = "p.id ASC";
    if (orderBy == "mostPopular") {
      order = "p.buys DESC";
    } else if (orderBy == "ton") {
      order = "p.inventory_quantity ASC";
    }

    params.push(offset * limit, limit);

    return db.load(
      `SELECT ${viewFields}
       FROM ${TABLE}
       WHERE 1 = 1 ${condition}
       ORDER BY ${order} 
       LIMIT ?,?`,
      params
    );
  },

  count: ({ name, category_id}) => {
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
    condition = buildCondition(
      condition,
      params,
      ` AND category_id = ?`,
      category_id
    );

    return db.load(
      `SELECT COUNT(*) AS sl 
       FROM products p WHERE 1=1  ${condition}`,
      params
    );
  },

  add: (entity) => db.add("products", entity),
  edit: (entity, id) => db.edit("products", entity, { id: id }),
  del: (id) => db.del("products", { id: id }),
};
