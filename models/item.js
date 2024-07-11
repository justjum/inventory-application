const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemSchema =  new Schema({
    model: { type: String, required: true, maxLength: 100 },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    description: { type: String, required: true, maxLength: 500 },
    price: { type: Number, required: true, max: 20000},
    quantity: { type: Number, required: true, default: 0, max: 100 },
    image: { type: String },
    image_alt: { type: String, maxLength: 50}
})

ItemSchema.virtual("url").get(function() {
    return `/inventory/item/${this._id}`
})

// Virtual for formatted price
ItemSchema.virtual("price_formatted").get(function () {
    return `$${this.price}`;
})

// Virtual for Image URL
ItemSchema.virtual("image_url").get(function() {
    return `../public/images/${this.image}`
})


module.exports = mongoose.model("Item", ItemSchema)