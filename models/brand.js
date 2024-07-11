const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BrandSchema = new Schema({
    name: { type: String, required: true, maxLength: 30 },
    website: { type: String, maxLength: 100 }
})

BrandSchema.virtual('url', function() {
    return `/inventory/brands/${this.name}`
})

module.exports = mongoose.model("Brand", BrandSchema)