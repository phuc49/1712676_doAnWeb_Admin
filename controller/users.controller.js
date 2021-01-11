const queryString = require("query-string");
const formidable = require("formidable");
const dateFormat = require("dateformat");
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

  dateFormat.masks.hammerTime = "yyyy-mm-dd";
  user[0].date_of_birth = dateFormat(
    user[0].date_of_birth,
    "hammerTime"
  );
  
  res.render('user', {dsl,u: user[0]});
}


exports.account = async (req,res,next) => {
  if (!req.user) {
    res.redirect("/");
  }
console.log(req.user);
  const user = await model.singleID(req.user.id);
  const dsl = await loai.all();

  dateFormat.masks.hammerTime = "yyyy-mm-dd";
  user[0].date_of_birth = dateFormat(
    user[0].date_of_birth,
    "hammerTime"
  );
  
  res.render('admin', {dsl,u: user[0]});
}


exports.editAdmin = async (req, res, next) => {
  if (!req.user) {
    res.redirect("/");
  }
  const form = formidable({ multiples: true });

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }

    const coverImage = files.image;

    if (coverImage && coverImage.size > 0) {
      const fileName =
        coverImage.path.split("\\").pop() +
        "." +
        coverImage.name.split(".").pop();
      fs.renameSync(
        coverImage.path,
        process.env.user_image_folder + "/users/" + fileName
      );
      fields.image = "/images/users/" + fileName;
    }

    model.editAdmin(fields, req.user.id).then(() => {
      res.redirect("/account");
    });
  });
};

exports.lock = async (req, res, next) => {
  if (!req.user) {
    res.redirect("/");
  }
  if(req.user.id == req.params.id) return;

  const status = "đã khóa";
  model.edit({status}, req.params.id).then(() => {
    res.redirect("/users/user/" + req.params.id);
  }); 
};

exports.unlock = async (req, res, next) => {
  if (!req.user) {
    res.redirect("/");
  }
  if(req.user.id == req.params.id) return;

  const link = "/users/user/" + req.params.id;
  const status = "đang hoạt động";
  model.edit({status}, req.params.id).then(() => {
    res.redirect("/users/user/" + req.params.id);
  }); 
};
