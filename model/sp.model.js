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
  all: (offset, limit, { name, category_id, price, discount, orderBy }) => {
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
    condition = buildCondition(condition, params, ` AND price <= ?`, price);
    condition = buildCondition(
      condition,
      params,
      ` AND discount >= ?`,
      discount
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
  allByPage: (offset, limit) =>
    db.load(
      `SELECT ${viewFields}
       FROM ${TABLE}
       LIMIT ?,?`,
      [offset * limit, limit]
    ),

  count: ({ name, category_id, price, discount }) => {
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
    condition = buildCondition(condition, params, ` AND price <= ?`, price);
    condition = buildCondition(
      condition,
      params,
      ` AND discount >= ?`,
      discount
    );

    return db.load(
      `SELECT COUNT(*) AS sl 
       FROM products p WHERE 1=1  ${condition}`,
      params
    );
  },

  countByCategory: (category) =>
    db.load(`SELECT COUNT(*) AS sl FROM products WHERE id = ${category}`),
  allByName: (productName, offset, limit) =>
    db.load(
      `SELECT ${viewFields} 
       FROM ${TABLE} 
       WHERE p.name LIKE '%${productName}%' 
       LIMIT ?,?`,
      [offset * limit, limit]
    ),
  countByName: (productName) =>
    db.load(
      `SELECT COUNT(*) AS sl FROM products WHERE name LIKE '%${productName}%'`
    ),
  add: (entity) => db.add("products", entity),
  edit: (entity, id) => db.edit("products", entity, { id: id }),
  del: (id) => db.del("products", { id: id }),
};
