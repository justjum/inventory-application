const express = require('express');
const router = express.Router();

// Require controller modules.
const item_controller = require("../controllers/itemController");
const category_controller = require("../controllers/categoryController");
const brand_controller = require("../controllers/brandController");

router.get("/", item_controller.index);

router.get("/items", item_controller.allItems);

router.get("/item/:id", item_controller.item_detail);

router.get("/brands", brand_controller.allBrands);

router.get("/brand/:id", brand_controller.brand_detail);

router.get("/categories", category_controller.allCategories);

router.get("/category/:id", category_controller.category_detail);

module.exports = router;