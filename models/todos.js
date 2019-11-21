const mongoose = require("mongoose");

const todosSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    isCompleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const TodosModel = mongoose.model("Todos", todosSchema);

module.exports = TodosModel;
