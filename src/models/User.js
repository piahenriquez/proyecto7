const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    cart: {
      type: mongoose.Types.ObjectId,
      ref: "Cart",
      default: null,
    },
    favorites: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        default: [],
      },
    ],
    country: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    zipcode: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
