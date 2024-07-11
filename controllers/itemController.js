const Item = require("../models/item");
const Brand = require("../models/brand");
const Category = require("../models/category");

const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const category = require("../models/category");

exports.index = asyncHandler(async (req, res, next) => {
    // get details of all items, categories, and brands
    const [
        numItems,
        numBrands,
        numCategories
    ] = await Promise.all([
        Item.countDocuments({}).exec(),
        Brand.countDocuments({}).exec(),
        Category.countDocuments({}).exec()
    ])
    res.render("index", {
        title: "Inventory Application",
        item_count: numItems,
        brand_count: numBrands,
        category_count: numCategories
    });
});

exports.allItems = asyncHandler(async (req, res, next) => {
    const allItems = await Item.find({})
        .populate('category')
        .populate('brand')
        .exec();
        
    allItems.sort((a, b) => {
        const brandA = a.brand.name;
        const brandB = b.brand.name;
        if (brandA < brandB) {
            return -1;
        }
        if (brandB < brandA) {
            return 1;
        }

        return 0;
    });

    res.render("items", {
        title: "All Items",
        items: allItems,
    });
});

exports.item_detail = asyncHandler(async (req, res, next) => {
    const item_current = await Item.findById(req.params.id)
        .populate('brand')
        .populate('category')
        .exec()
        

    res.render('item_detail', {
        title: 'Item Details',
        item: item_current
    });
});


