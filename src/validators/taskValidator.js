const { z } = require('zod');

const statusEnum = z.enum(['pending', 'in-progress', 'completed']);

const createTaskSchema = z.object({
  title: z.string().min(1, 'title is required'),
  description: z.string().optional().nullable(),
  status: statusEnum.optional()
});

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  status: statusEnum.optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field (title or status) must be provided'
});

const uuidParamSchema = z.string().uuid('Invalid task ID format');

module.exports = { createTaskSchema, updateTaskSchema, uuidParamSchema };

