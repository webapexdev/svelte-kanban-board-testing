import type { Task } from '../schemas/task';

// In-memory task storage
export let tasks: Task[] = [];

// Example tasks (not auto loaded, enable manually if needed)
export const exampleTasks: Task[] = [
  {
    id: 'demo-1',
    title: 'Write project documentation',
    description: 'Prepare README with setup and architecture overview',
    due_date: '2025-09-20',
    photo: undefined,
    status: 'todo',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'demo-2',
    title: 'Fix Kanban drag & drop bug',
    description: 'Investigate why tasks sometimes drop into wrong column',
    due_date: '2025-09-15',
    photo: '/uploads/demo-screenshot.png',
    status: 'in-progress',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
