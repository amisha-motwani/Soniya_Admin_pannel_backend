const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotesSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  fabric: {
    type: String,
    require: true,
  },
  price: {
    type: String,
    require: true,
  },
  color: {
    type: String,
    require: true,
  },
  image: {
    type: String,
  },
  Polo_collar: {
    type: Boolean,
  },
  Round_neck: {
    type: Boolean,
  },
  Cloth_collar: {
    type: Boolean,
  },
  Readymade_collar: {
    type: Boolean,
  },
  printing_charges: {
    type: String,
  },
  printing_area: {
    type: String,
  },
  size: {
    type: String,
    require: true,
  },
  sleeves_type: {
    type: String,
  },
  category: {
    type: String,
    index: true
  },
  sub_category: {
    type: String,
  },
  Product_code: {
    type: String,
    index: true
  },
  Product_Quantity: {
    type: Number,
    index: true
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", NotesSchema);
