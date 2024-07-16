const Brand = require("../models/brand")
const Item = require("../models/item")

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

exports.brand_create_get = asyncHandler(async (req, res, next) => {
    res.render('brand_form', {
        title: "Create Brand"
    })
});

exports.brand_create_post = [
    body("name", "Must have brand name.").isLength(min=1).escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const brand = await Brand.findOne({name:req.body.name}).exec();
        
        if (brand !== null) {
            console.log('redirect')
            res.redirect(brand.url)
            return;
        }

        const newBrand = new Brand({
            name: req.body.name,
            website: req.body.website
        })

        if (!errors.isEmpty()) {
            res.render('brand_form', {
                title: 'Create Brand',
                newBrand: newBrand,
                errors: errors.array()
            })

        }

        else {
            await newBrand.save();
            res.redirect(newBrand.url)
        }
    })
]

exports.brand_delete_get = asyncHandler(async (req, res, next) => {
    const [currentBrand, allItems] = await Promise.all([
        Brand.findById(req.params.id).exec(),
        Item.find({ brand: req.params.id })
            .populate('brand')
            .exec()
    ])

    res.render('brand_delete', {
        title: 'Delete Brand',
        brand: currentBrand,
        items: allItems
    })
})

exports.brand_delete_post = asyncHandler(async (req, res, next) => {
    await Brand.findByIdAndDelete(req.body.brandid);
    res.redirect('/inventory/brands');
})

exports.brand_update_get = asyncHandler(async (req, res, next) => {
    const brand = await Brand.findById(req.params.id)
    res.render('brand_form', {
        title: "Update Brand",
        newBrand: brand
    })
});

exports.brand_update_post = [
    body("name", "Must have brand name.").isLength(min=1).escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const brand = new Brand({
            _id: req.params.id,
            name: req.body.name,
            website: req.body.website
        })

        if (!errors.isEmpty()) {
            res.render('brand_form', {
                title: 'Update Brand',
                newBrand: brand,
                errors: errors.array()
            })
            return
        }

        else {
            const updatedBrand = await Brand.findByIdAndUpdate(req.params.id, brand, {});
            res.redirect('/inventory/brands')
        }
    })
]

