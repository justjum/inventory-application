#! /usr/bin/env node
const dotenv = require('dotenv');

console.log(
    'This script populates some test items, categories, and brands. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  // import object classes
  const Brand = require("./models/brand");
  const Category = require("./models/category");
  const Item = require("./models/item");

  // Create empty arrays for each of the objects
  const brands = [];
  const categories = [];
  const items = [];

  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false);

  dotenv.config();
  const dev_db_url = process.env.MONGOLAB_URI;
  const mongoDB = process.env.MONGODB_URI || dev_db_url;
  
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createBrands();
    await createCategories();
    await createItems();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  // We pass the index to the ...Create functions so that, for example,
  // genre[0] will always be the Fantasy genre, regardless of the order
  // in which the elements of promise.all's argument complete.
  async function brandCreate(index, name, website) {
    const brand = new Brand({ name: name, website: website  });
    await brand.save();
    brands[index] = brand;
    console.log(`Added brand: ${name}`);
  }

  async function categoryCreate(index, name) {
    const category = new Category({ name: name});
    await category.save();
    categories[index] = category;
    console.log(`Added category: ${name}`);
  }
  
  async function itemCreate(index, brand, model, category, description, price, image, image_alt, quantity, featured=false) {
    const itemdetail = {
      brand: brand,
      model: model,
      category: category,
      description: description,
      price: price,
      image: image, 
      image_alt: image_alt,
      quantity: quantity,
    };
  
    const item = new Item(itemdetail);
    await item.save();
    items[index] = item;
    console.log(`Added item: ${brand} ${model}`);
  }
  
  async function createBrands() {
    console.log("Adding brands");
    await Promise.all([
      brandCreate(0, "Maton", 'https://maton.com.au/'),
      brandCreate(1, "Gibson", 'https://www.gibson.com'),
      brandCreate(2, "Fender", 'https://www.fender.com'),
      brandCreate(3, "Eastman", 'https://www.eastmanguitars.com'),
      brandCreate(4, "Yamaha", 'https://au.yamaha.com')
    ]);
  }

  async function createCategories() {
    console.log("Adding Categories");
    await Promise.all([
      categoryCreate(0, "Acoustic"),
      categoryCreate(1, "Electric"),
      categoryCreate(2, "Bass"),
      categoryCreate(3, "Ukulele")
    ]);
  }

  async function createItems() {
    console.log("Adding Items");
    await Promise.all([
      itemCreate(
        0, 
        brands[0], 
        "EC-335", 
        categories[0], 
        "A mighty fine acoustic.", 
        1500, 
        'maton.png', 
        'Maton Acoustic', 
        3
      ),
      itemCreate(
        1, 
        brands[1], 
        "Vintage SG", 
        categories[1], 
        "A classic. Worth more than your car.", 
        15000, 
        'gibson.jpg', 
        'Gibson SG', 
        1, 
      ),
      itemCreate(
        2, 
        brands[2], 
        "Stratocaster", 
        categories[1], 
        "The everyman's axe.", 
        2500, 
        'stratocaster.jpg', 
        'Fender Stratocaster', 
        4),
      itemCreate(
        3, 
        brands[2], 
        "FA-125CE", 
        categories[0], 
        "The single-cutaway FA-125CE combines Fender tone and style with our FE-A2 electronics for a guitar that was made to take the stage. Quality laminate construction with a modern Fender 3+3 headstock and Viking bridge create a great-sounding instrument that’s easy to play. Beginners and developing players will appreciate the nato neck that gives the guitar a lively tone and smooth, easy playing feel.", 
        1250, 
        'fender-acoustic.jpg', 
        'Fender Acoustic', 
        5, 
      ),
      itemCreate(4, 
        brands[2], 
        "Telecaster", 
        categories[1], 
        "Bold, innovative and rugged, the Player Telecaster is pure Fender, through and through. The feel, the style and, most importantly, the sound—they’re all there, waiting for you to make them whisper or wail for your music. Versatile enough to handle almost anything you can create and durable enough to survive any gig, this workhorse is a trusty sidekick for your musical vision.", 
        2250, 
        'fender-telecaster.jpg', 
        'Fender Telecaster', 
        3, 
      ),
      itemCreate(
        5, 
        brands[3], 
        "Night Acoustic", 
        categories[0], 
        "Want to look like Johnny Cash? Go with this badboy.", 
        500, 
        'eastman-acoustic.jpg', 
        'Black Eastman Acoustic'),
      itemCreate(
        6, 
        brands[3], 
        "Tweety", 
        categories[1],  
        "This thing is pretty.  Like, real pretty.", 
        850, 
        'eastman.jpg', 
        'Red Eastman Hollow Body', 
        5, 
      ),
      itemCreate(
        7, 
        brands[2], 
        "Jazz Bass", 
        categories[2], 
        "Right here, you'll be slappin' da bass. Oooh, yeah.", 
        1150, 
        'jazzbass.png', 
        'Fender Jazz Bass', 
        7),
      itemCreate(
        8, 
        brands[4], 
        "Classical", 
        categories[0], 
        "For those with a nylon persuasion", 
        300, 
        'yamaha-classical.jpg', 
        'Yamaha Classical Guitar', 
        34),
      itemCreate(
        9, 
        brands[4], 
        "Little Fly",
        categories[3], 
        "Ukuleleeeeeeeeeeeeeeee", 
        150, 
        'yamaha-ukulele.jpg', 
        'Yamaha Ukulele',
        52),
      itemCreate(
        10, 
        brands[4], 
        "TRBX-174", 
        categories[2], 
        "Hmmm Yup. More Bass.", 
        750, 
        'yamaha-bass.jpg', 
        'Yamaha Bass Guitar', 
        2),
    ])
  }
  