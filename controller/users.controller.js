const queryString = require("query-string");
const fs = require("fs");
require("dotenv").config();

const model = require("../model/users.model");
const loai = require('../model/loai.model');

exports.all = async (req, res, next) => {
  if (!req.user) {
    res.redirect("/");
  }
  let qs = { ...req.query };

  /// phân trang
  let page = +req.query.page || 1;
  const limit = +req.query.page_size || 12;
  const { category: category_id, name, orderBy } = req.query;

  const count = await model.count({ category_id, name });
  lastPage = Math.ceil(count[0].sl / limit);
  qs.page = lastPage;
  const lastPageQs = queryString.stringify(qs);

  const pageList = [];
  page = Math.min(lastPage, page);
  page = Math.max(1, page);
  for (let i = Math.max(1, page - 1); i <= Math.min(page + 1, lastPage); i++) {
    qs.page = i;
    pageList.push({
      qs: queryString.stringify(qs),
      active: i === page,
      page: i,
    });
  }

  delete qs.page;
  delete qs.orderBy;
  const dssp = await model.all(page - 1, limit, {
    category_id,
    name,
    orderBy,
  });
  const dsl = await loai.all();
  res.render("users", {
    dssp,
    pageList,
    lastPageQs,
    dsl,
    qs: queryString.stringify(qs),
  });
};

exports.singleID = async (req,res,next) => {
  if (!req.user) {
    res.redirect("/");
  }
  const user = await model.singleID(req.params.id);
  const dsl = await loai.all();
  
  res.render('user', {dsl,u: user[0]});
}
