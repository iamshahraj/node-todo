const express = require('express');

const router = express.Router();
const todosController = require('../controllers/todos');

router.get('/list', todosController.listTodos)
router.post('/add', todosController.addTodo)
router.get('/list/:id', todosController.getTodoById)
router.put('/update/:id', todosController.editTodo)
router.delete('/remove/:id', todosController.removeTodo)

module.exports = router;