// Models
const TodosModel = require("../../models/todos");

// Validation package
const Joi = require("@hapi/joi");

// Validation schemas
const addAndUpdateTodoSchema = Joi.object({
  title: Joi.string().required(),
  isCompleted: Joi.boolean()
});

const removeOrViewTodoSchema = Joi.object({
  id: Joi.string().required()
});

exports.addTodo = async (req, res, next) => {
  try {
    let request_data = {
      title: req.body.title
    };
    // Validating data
    await addAndUpdateTodoSchema.validateAsync(request_data);
    // Saving data to model
    const todo = await TodosModel(request_data).save();

    res.status(200).json({
      todo: todo,
      message: "Todo successfully added"
    });
  } catch (error) {
    return next(error);
  }
};

exports.editTodo = async (req, res, next) => {
  try {
    let request_data = {
      title: req.body.title,
      isCompleted: req.body.completed || false
    };
    const params = req.params;

    // Validating data
    await addAndUpdateTodoSchema.validateAsync(request_data);
    await removeOrViewTodoSchema.validateAsync(params);

    // Updating data to model
    await TodosModel.findOneAndUpdate(
      { _id: params.id },
      { $set: { ...request_data } }
    ).lean();

    res.status(200).json({
      message: "Todo updated successfully"
    });
  } catch (error) {
    if (error.name === "CastError") {
      let missingError = new Error("Todo with this id does not exist");
      missingError.statusCode = 404;
      return next(missingError);
    }
    return next(error);
  }
};

exports.removeTodo = async (req, res, next) => {
  try {
    let request_data = req.params;
    // Validating data
    await removeOrViewTodoSchema.validateAsync(request_data);
    // delelting data from model
    const isDeleted = await TodosModel.findOneAndRemove({
      _id: request_data.id
    });

    if (isDeleted && isDeleted !== null) {
      res.status(200).json({
        message: "Todo removed successfully"
      });
    }
    res.status(404).json({
      message: "Todo with this id does not exist"
    });
  } catch (error) {
    return next(error);
  }
};

exports.getTodoById = async (req, res, next) => {
  try {
    let request_data = req.params;
    // Validating data
    await removeOrViewTodoSchema.validateAsync(request_data);

    // Getting data from db
    const todo = await TodosModel.findById(request_data.id);

    if (todo && todo !== null) {
      res.status(200).json({
        data: todo
      });
    }
    res.status(404).json({
      message: "Todo with this id does not exist"
    });
  } catch (error) {
    if (error.name === "CastError") {
      let missingError = new Error("Todo with this id does not exist");
      missingError.statusCode = 404;
      return next(missingError);
    }
    return next(error);
  }
};

exports.listTodos = async (req, res, next) => {
  try {
    const from = Number(req.query.from);
    const limit = Number(req.query.limit);

    let todos;
    if (from && limit) {
      // Paginated list
      todos = await TodosModel.find()
        .skip(from)
        .limit(limit);
    } else {
      // Normal list
      todos = await TodosModel.find();
    }

    res.status(200).json({
      todos_array: todos
    });
  } catch (error) {
    return next(error);
  }
};
