const formidable = require('formidable');
const queryString = require("query-string");
const fs = require('fs');
require('dotenv').config();

const model = require('../model/sp.model');
const loai = require('../model/loai.model');

exports.all = async (req, res, next) => {
  let qs = { ...req.query };
  //const q = queryString.stringify(qs);
  /// phân trang
  let page = +req.query.page || 1;
  const limit = +req.query.page_size || 12;
  const { category: category_id, name, price, discount, orderBy } = req.query;

  const count = await model.count({ category_id, name, price, discount });
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
    price,
    discount,
    orderBy 
  });
  const dsl = await loai.all();
  res.render("index", {
    dssp,
    pageList,
    lastPageQs,
    dsl,
    qs: queryString.stringify(qs)
  });
};


exports.allByCategory = async (req, res, next) => {
  console.log(req.params.id)
    const page = +req.query.page || 1;
    const limit = +req.query.page_size || 12;
    const count = await model.countByCategory(req.params.id);
    const len = Math.ceil((count[0].sl)/limit);
  
    const pageList = [];
    for (let i = page - 1; i <= Math.min(page + 1, len) ; i++) {
      if (i > 0) pageList.push({ page: i, active: i === page });
    }
  
    const dssp = await model.allByCategory(req.params.id, page-1, limit);

    const dsl = await loai.all();
    res.render("index", { dssp, page, pageList, len , dsl});
  };

exports.singleID = async (req,res,next) => {
  const sp = await model.singleID(req.params.id);
  const dsLoai = await loai.all();
  var dsl = [];
  for(var i = 0; i < dsLoai.length; i++){
    dsl.push({selected:(dsLoai[i].id == sp[0].category_id), name:dsLoai[i].name, id:dsLoai[i].id});
  }
  
  res.render('chitiet', {dsl, p: sp[0]});
}


exports.allByName = async (req, res, next) => {
  const page = +req.query.page || 1;
  const limit = +req.query.page_size || 12;

  const count = await model.countByName(req.body.name);
  const len = Math.ceil((count[0].sl)/limit);
  

  const pageList = [];
  for (let i = page - 1; i <= Math.min(page + 1, len) ; i++) {
    if (i > 0) pageList.push({ page: i, active: i === page });
  }

  const dssp = await model.allByName(req.body.name, page-1, limit);
  const dsl = await loai.all();
  res.render("index", { dssp, page, pageList, len, dsl });
};

exports.add = async (req, res, next) => {
  const entity = req.body;
  if(entity)
  {
    await model.add(entity);
  }
};

exports.edit = async (req, res, next) => {
  console.log(req.body);
  const form = formidable({ multiples: true });

  form.parse(req, (err, fields, files) => {
    if(err){
      next(err);
      return;
    }

    const coverImage = files.image;

    if(coverImage && coverImage.size > 0){
      const fileName = coverImage.path.split('\\').pop() + '.' + coverImage.name.split('.').pop();
      fs.renameSync(coverImage.path, process.env.product_image_folder + '/' + fileName);
      fields.image =" /images/sp/" + fileName;
    }
    
    model.edit(fields, req.params.id).then(() => {
      res.redirect("/");
    });
  });
} 

exports.them = async (req,res,next) => {
  const dsl = await loai.all();
  res.render('chitiet', {dsl});
}


exports.add = async (req, res, next) => {
  console.log(req.body);
  const form = formidable({ multiples: true });

  form.parse(req, (err, fields, files) => {
    if(err){
      next(err);
      return;
    }

    const coverImage = files.image;

    if(coverImage && coverImage.size > 0){
      const fileName = coverImage.path.split('\\').pop() + '.' + coverImage.name.split('.').pop();
      fs.renameSync(coverImage.path, process.env.product_image_folder + '/' + fileName);
      fields.image =" /images/sp/" + fileName;
    }
    
    delete fields.product_id;
    model.add(fields).then(() => {
      res.redirect("/");
    });
  });
} 

exports.delete = (req,res,next) => {
  model.del(req.params.id).then(() => {
    res.redirect("/");
  });
}

