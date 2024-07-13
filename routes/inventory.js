const express = require('express');
const router = express.Router();

// Require controller modules.
const item_controller = require("../controllers/itemController");
const category_controller = require("../controllers/categoryController");
const brand_controller = require("../controllers/brandController");

router.get("/", item_controller.index);

router.get("/items", item_controller.allItems);

router.get("/item/create", item_controller.item_create_get);

router.post("/item/create", item_controller.item_create_post);

router.get("/item/:id", item_controller.item_detail);

router.get("/brands", brand_controller.allBrands);

router.get("/brand/create", brand_controller.brand_create_get);

router.post("/brand/create", brand_controller.brand_create_post)

router.get("/brand/:id", brand_controller.brand_detail);

router.get("/categories", category_controller.allCategories);

router.get("/category/create", category_controller.category_create_get);

router.post("/category/create", category_controller.category_create_post);

router.get("/category/:id", category_controller.category_detail);

module.exports = router;