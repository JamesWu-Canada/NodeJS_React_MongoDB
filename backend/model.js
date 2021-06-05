const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    work: {
      type: String,
      required: true,
      maxlength: [100, "name cannot be more than 100 characters"],
    },
    phone: {
      type: String,
      required: true,
      maxlength: [20, "name cannot be more than 20 characters"],
    },
    email: {
      type: String,
      required: true,
      maxlength: [50, "name cannot be more than 50 characters"],
    },
    status: {
      type: String,
      enum: ["pending", "completed", "rejected", "accepted"],
      required: true,
    },
    comment: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      maxlength: [50, "name cannot be more than 50 characters"],
    },

    password: {
      type: String,
      required: true,
      unique: false,
    },
  },
  {
    timestamps: true,
  }
);

exports.Order = mongoose.model("Order", OrderSchema, "orders");
exports.User = mongoose.model("User", UserSchema, "users");
