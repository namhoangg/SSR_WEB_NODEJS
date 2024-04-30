const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const productSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    product_category_id: {
      type: String,
      default: "",
    },
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    deleted: {
      type: Boolean,
      default: false,
    },
    position: Number,
    slug: { type: String, slug: "title", unique: true },
    createdBy: {
      account_id: String,
      createdAt: Date,
    },
    deletedBy: {
      account_id: String,
      deletedAt: Date,
    },
    featured: String,
    updatedBy: {
      type: [
        {
          account_id: String,
          updatedAt: Date,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);
const Product = mongoose.model("Product", productSchema, "products");
module.exports = Product;
