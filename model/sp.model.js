const db = require("./db.js");

module.exports = {
    singleID: (productId) =>
      db.load(`select * from san_pham sp, loai_sp l where sp.ma_sp = ${productId} and sp.loai = l.ma_loai`),
    all: () =>
      db.load("select * from san_pham sp, loai_sp l where sp.loai = l.ma_loai"),
    allByPage: (offset,limit)=>db.load(`SELECT * FROM san_pham sp, loai_sp l 
                                        WHERE sp.loai = l.ma_loai
                                        LIMIT ?,?`,[offset * limit, limit]),
    count: () => db.load("SELECT COUNT(*) AS sl FROM san_pham"),
    allByCategory: (category, offset,limit)=>db.load(`SELECT * FROM san_pham sp, loai_sp l 
                                                  WHERE l.ma_loai = ${category} AND sp.loai = ${category}
                                                  LIMIT ?,?`,[offset * limit, limit]),
    countByCategory: (category) => db.load(`SELECT COUNT(*) AS sl FROM san_pham WHERE loai = ${category}`),
    allByName: (productName, offset,limit)=>db.load(`SELECT * FROM san_pham sp, loai_sp l 
                                             WHERE sp.ten_sp LIKE '%${productName}%' AND sp.loai = l.ma_loai
                                             LIMIT ?,?`,[offset * limit, limit]),
    countByName: (productName) => db.load(`SELECT COUNT(*) AS sl FROM san_pham WHERE ten_sp LIKE '%${productName}%'`),
    add: (entity) => db.add("san_pham", entity),
    edit: (entity, id) => db.edit("san_pham", entity, {ma_sp: id})
};

