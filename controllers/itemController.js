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
    console.log('Got list')
 
// Sort algorithm too slow 
    allItems.sort((a, b) => {
        const brandA = a.brand.name;
        const brandB = b.brand.name;
        if (brandA < brandB) {
            return -1;
        }
        if (brandB > brandA) {
            return 1;
        }

        return 0;
    });
    console.log('Sorted')

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
    
    if (item_current === null) {
        const err = new Error('Item does not exist');
        err.status = 404;
        return next(err)
    }    

    res.render('item_detail', {
        title: 'Item Details',
        item: item_current
    });
});

exports.item_create_get = asyncHandler(async (req, res, next) => {
    const [ allBrands, allCategories ] = await Promise.all([
        Brand.find({}).sort({name:1}).exec(),
        Category.find({}).sort({name:1}).exec()
    ])

    res.render('item_form', {
        title: "Create Item",
        categories: allCategories,
        brands: allBrands,
    });
})

exports.item_create_post = [
    // Validate and sanitize forms
    body("category", "Category must be specified").trim().escape(),
    body("brand", "Brand must be satisfied").trim().escape(),
    body("model", "Model must be specified")
        .trim()
        .isLength({ min: 1})
        .escape(),
    body("description", "Description must be specified")
        .trim()
        .isLength( {min: 1, max:100})
        .escape(),
    body("price", "Price must be between $1 and $20000")
        .trim()
        .isNumeric({min: 1, max: 20000})
        .escape(),
    body("quantity", "Quantity must be between 1 and 100")
        .trim()
        .isNumeric({min: 1, max: 100}),
    
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const item = new Item({
            category: req.body.category,
            brand: req.body.brand,
            model: req.body.model,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity,
        });

        if(!errors.isEmpty()) {
            // There are errors, render form with sanitized values and messages.
            const [ allBrands, allCategories ] = await Promise.all([
                Brand.find({}).exec(),
                Category.find({}).exec()
            ])

            res.render("item_form", {
                title: "Create Item",
                brands: allBrands,
                categories: allCategories,
                errors: errors.array(),
                item: item
            })
        }

        else {
            // Place holders for image functions
            await item.save();
            res.redirect(item.url);
        }  
    })    
]

exports.item_delete_get = asyncHandler(async(req, res, next) => {
    current_item = await Item.findById(req.params.id);
    res.render('item_delete', {
        title: 'Delete Item:',
        item: current_item
    });
}) 

exports.item_delete_post = asyncHandler(async( req, res, next) => {
    await Item.findByIdAndDelete(req.body.itemid);
    res.redirect('/inventory/items')
})