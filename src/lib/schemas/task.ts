import { z } from 'zod';

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string().min(3, "Title must be at least 3 characters long").max(100),
  description: z.string().max(500).optional(),
  due_date: z.string().optional(),
  photo: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'done']),
  created_at: z.string(),
  updated_at: z.string()
});

export const TaskInputSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long").max(100, "Title must be at most 100 characters long"),
  description: z.string().max(500, "Description must be most 500 characters long").optional(),
  due_date: z.string().optional(),
  photo: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'done']).default('todo')
});

export type Task = z.infer<typeof TaskSchema>;
export type TaskInput = z.infer<typeof TaskInputSchema>;
