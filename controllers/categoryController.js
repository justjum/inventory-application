const Category = require('../models/category');
const asyncHandler = require('express-async-handler');

const { body, validationResult } = require('express-validator');

exports.allCategories = asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find({}).exec();

    res.render('categories', {
        title: 'All Categories',
        categories: allCategories
    });
});

exports.category_detail = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id).exec();

    if (category === null) {
        const err = new Error('Category does not exist');
        err.status = 404;
        return next(err);
    }

    res.render('category_detail', {
        title: "Category Detail:",
        category: category,
    });
});
