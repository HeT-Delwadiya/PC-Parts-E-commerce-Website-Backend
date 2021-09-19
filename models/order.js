const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const cartSchema = new mongoose.Schema({
  product: {
    type: ObjectId,
    ref: "Product"
  },
  name: String,
  count: Number,
  price: Number
});

const ProductsInCart = mongoose.model("Cart", cartSchema);

const OrderSchema = new mongoose.Schema(
  {
    products: [cartSchema],
    transaction_id: {},
    amount: { type: Number },
    address: String,
    updated: Date,
    user: {
      type: ObjectId,
      ref: "User"
    },
    status: {
      type: String,
      default: "Received",
      enum: ["Received","Processing","Shipped","Cancelled","Completed","Delivered"]
    },
    userInfo: {}
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = { Order, ProductsInCart };
