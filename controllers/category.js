require('dotenv').config();
const mongoose = require('mongoose');
const University = mongoose.model('University');
const Course = mongoose.model('Course');
const Educator = mongoose.model('Educator');
const Category = require("../models/category");
const slugify = require("slugify");
const shortid = require("shortid");
const upload = require('../middlewares/multer');
const cloudinary = require('cloudinary');
require('../middlewares/cloudinary');


function createCategories(categories, parentId = null) {
  const categoryList = [];
  let category;
  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined);
  } else {
    category = categories.filter((cat) => cat.parentId == parentId);
  }

  for (let cate of category) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      parentId: cate.parentId,
      children: createCategories(categories, cate._id),
    });
  }

  return categoryList;
}

exports.addCategory = async (req, res) => {

  const categoryObj = {
    name: req.body.name,
    slug: `${slugify(req.body.name)}-${shortid.generate()}`,
  };
  if (req.body.parentId) {
    categoryObj.parentId = req.body.parentId;
  }

  const cat = new Category(categoryObj);
  cat.save((error, category) => {
    if (error) return res.status(400).json({ error });
    if (category) {
      return res.status(201).json({ category });
    }
  });
};

exports.getCategories = (req, res) => {
  Category.find({}).exec((error, categories) => {
    if (error) return res.status(400).json({ error });
    if (categories) {
      const categoryList = createCategories(categories);
      res.status(200).json({ categoryList });
    }
  });
};

exports.getCouresById = async (req, res) => {
  try {
    const id = req.params.id;
    const course = await Course.find({ category: id });
    // console.log(course);
    res.json(course);
  } catch (err) {
    res.json(err)
    console.log(err);
  }
}

exports.getUniversityByCourse = async (req, res) => {
  try {
    const cid = req.params.cid;
    const course = await Course.findById(cid).populate("Universities");
    res.json(course.Universities);
  } catch (err) {
    res.json(err)
    console.log(err);
  }
}
exports.getFull = async (req, res) => {
  try {
    const cid = req.params.cid;
    const uid = req.params.uid;
    var temp1, temp2;
    const university = await University.findById(uid);
    for (let cate of university.courses) {
      if (cate.course == cid) {
        temp1 = cate.course;
        temp2 = cate.Educator;
      } else {
      }
    }
    const course = await Course.findById(cid);
    const educator = await Educator.findById(temp2);

    res.json({ full:{university, course, educator} })
    } catch (err) {
    res.json(err)
    console.log(err);
  }
}
exports.updateCategories = async (req, res) => {
  const { _id, name, parentId, type } = req.body;
  const updatedCategories = [];
  if (name instanceof Array) {
    for (let i = 0; i < name.length; i++) {
      const category = {
        name: name[i],
        type: type[i],
      };
      if (parentId[i] !== "") {
        category.parentId = parentId[i];
      }

      const updatedCategory = await Category.findOneAndUpdate(
        { _id: _id[i] },
        category,
        { new: true }
      );
      updatedCategories.push(updatedCategory);
    }
    return res.status(201).json({ updateCategories: updatedCategories });
  } else {
    const category = {
      name,
      type,
    };
    if (parentId !== "") {
      category.parentId = parentId;
    }
    const updatedCategory = await Category.findOneAndUpdate({ _id }, category, {
      new: true,
    });
    return res.status(201).json({ updatedCategory });
  }
};

exports.deleteCategories = async (req, res) => {
  const { ids } = req.body.payload;
  const deletedCategories = [];
  for (let i = 0; i < ids.length; i++) {
    const deleteCategory = await Category.findOneAndDelete({
      _id: ids[i]._id,
      createdBy: req.user._id,
    });
    deletedCategories.push(deleteCategory);
  }

  if (deletedCategories.length == ids.length) {
    res.status(201).json({ message: "Categories removed" });
  } else {
    res.status(400).json({ message: "Something went wrong" });
  }
};