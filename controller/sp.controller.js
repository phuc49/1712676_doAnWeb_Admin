const formidable = require('formidable');

const model = require('../model/sp.model');
const loai = require('../model/loai.model');

exports.all = async (req, res, next) => {
  const page = +req.query.page || 1;
  const limit = +req.query.page_size || 12;
  const count = await model.count();
  const len = Math.ceil((count[0].sl)/limit);

  const pageList = [];
  for (let i = page - 1; i <= Math.min(page + 1, len) ; i++) {
    if (i > 0) pageList.push({ page: i, active: i === page });
  }

  const dssp = await model.allByPage(page-1, limit);
  const dsl = await loai.all();
  res.render("index", { dssp, page, pageList, len, dsl });
};

exports.allByCategory = async (req, res, next) => {
  console.log(req.params.loai_sp)
    const page = +req.query.page || 1;
    const limit = +req.query.page_size || 12;
    const count = await model.countByCategory(req.params.loai_sp);
    const len = Math.ceil((count[0].sl)/limit);
  
    const pageList = [];
    for (let i = page - 1; i <= Math.min(page + 1, len) ; i++) {
      if (i > 0) pageList.push({ page: i, active: i === page });
    }
  
    const dssp = await model.allByCategory(req.params.loai_sp, page-1, limit);

    const dsl = await loai.all();
    res.render("index", { dssp, page, pageList, len , dsl});
  };

exports.singleID = async (req,res,next) => {
  const sp = await model.singleID(req.params.ma_sp);
  const dsLoai = await loai.all();
  var dsl = [];
  for(var i = 0; i < dsLoai.length; i++){
    dsl.push({selected:(dsLoai[i].ma_loai == sp[0].ma_loai), ten_loai:dsLoai[i].ten_loai, ma_loai:dsLoai[i].ma_loai});
  }

  res.render('chitiet', {dsl, sp: sp[0]});
}


exports.allByName = async (req, res, next) => {
  const page = +req.query.page || 1;
  const limit = +req.query.page_size || 12;

  const count = await model.countByName(req.body.ten);
  const len = Math.ceil((count[0].sl)/limit);
  

  const pageList = [];
  for (let i = page - 1; i <= Math.min(page + 1, len) ; i++) {
    if (i > 0) pageList.push({ page: i, active: i === page });
  }

  const dssp = await model.allByName(req.body.ten, page-1, limit);
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
  const form = formidable({ multiples: true });

  form.parse(req, (err, fields, files) => {
    if(err){
      next(err);
      return;
    }
    console.log(fields);
    model.edit(fields, req.params.ma_sp).then(() => {
      res.redirect("/");
    });
  });
} 