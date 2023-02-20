/** @format */

const mongoose = require("mongoose");

// create a task schema
const taskSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    date: { type: String, required: true },
    task: { type: String, required: true },
    status: { type: String, default: "pending" },
    order: { type: Number, default: null },
  },
  { timestamps: true }
);

// taskSchema.method("toJSON", (err, docs) => {});

taskSchema.methods.toJSON = function () {
  const { __v, __id, ...object } = this.toObject();
  object.id = __id;
  return object;
};

// create a new model using the schema
const taskModel = mongoose.model("Tasks", taskSchema);

module.exports = taskModel;
