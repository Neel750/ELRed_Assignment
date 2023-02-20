/** @format */

const mongoose = require("mongoose");

// create a user schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    emailVerified: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// userSchema.method("toJSON", () => {
//   const { __v, __id, ...object } = this.toObject();
//   object.id = __id;
//   return object;
// });

// create a new model using the schema
const userModel = mongoose.model("Users", userSchema);

module.exports = userModel;
