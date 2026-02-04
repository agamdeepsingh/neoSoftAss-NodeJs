const Task = require('../models/Task');
const { createTaskSchema, updateTaskSchema } = require('../validators/taskValidator');

exports.createTask = async (req, res) => {
  const parsed = createTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    const err = new Error('Validation failed');
    err.status = 400;
    err.details = parsed.error.format();
    throw err;
  }

  const { title, description, status } = parsed.data;
  const task = await Task.create({ title, description, status });
  res.status(201).json(task);
};

exports.getTasks = async (req, res) => {
  const { page, limit, offset } = req.pagination;

  const { count, rows } = await Task.findAndCountAll({
    limit,
    offset,
    order: [['created_at', 'DESC']]
  });

  res.json({ page, limit, total: count, data: rows });
};

exports.updateTask = async (req, res) => {
  const id = req.params.id;
  const parsed = updateTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    const err = new Error('Validation failed');
    err.status = 400;
    err.details = parsed.error.format();
    throw err;
  }

  const task = await Task.findByPk(id);
  if (!task) {
    const err = new Error('Task not found');
    err.status = 404;
    throw err;
  }

  const { title, status } = parsed.data;
  if (title !== undefined) task.title = title;
  if (status !== undefined) task.status = status;

  await task.save();
  res.json(task);
};

exports.deleteTask = async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (!task) {
    const err = new Error('Task not found');
    err.status = 404;
    throw err;
  }

  await task.destroy();
  res.status(200).json({ success: true, response: 'Deleted Successfully' });
};
