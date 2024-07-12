const Brand = require("../models/brand")

const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

exports.allBrands = asyncHandler(async (req, res, next) => {
    const allBrands = await Brand.find({})
        .sort({name:1})
        .exec()
    
    res.render('brands', {
        title: 'All Brands',
        brands: allBrands
    });
});

exports.brand_detail = asyncHandler(async (req, res, next) => {
    const brand = await Brand.findById(req.params.id).exec();

    if (brand === null) {
        const err = new Error('Brand does not exist');
        err.status = 404;
        return next(err)
    }

    res.render('brand_detail', {
        title: 'Brand Detail:',
        brand: brand
    });
});