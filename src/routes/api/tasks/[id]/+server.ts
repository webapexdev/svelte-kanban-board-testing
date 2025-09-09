import { json, error } from '@sveltejs/kit';
import { tasks } from '$lib/server/db';
import type { RequestHandler } from './$types';
import fs from 'fs';
import path from 'path';

export const GET: RequestHandler = async ({ params }) => {
  const task = tasks.find(t => t.id === params.id);
  if (!task) throw error(404, 'Task not found');
  return json(task);
};


export const PUT: RequestHandler = async ({ params, request }) => {
  const idx = tasks.findIndex((t) => t.id === params.id);
  if (idx === -1) throw error(404, 'Task not found');

  const form = await request.formData();
  const title = form.get('title') as string;
  const description = form.get('description') as string | null;
  const due_date = form.get('due_date') as string | null;
  const file = form.get('photo') as File | null;

  let photo = tasks[idx].photo; // keep existing photo if not replaced
  if (file && file.size > 0) {
    const uploadDir = path.join(process.cwd(), 'static', 'uploads');
    fs.mkdirSync(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(uploadDir, filename);

    fs.writeFileSync(filepath, buffer);
    photo = `/uploads/${filename}`;
  }

  tasks[idx] = {
    ...tasks[idx],
    title,
    description: description || undefined,
    due_date: due_date || undefined,
    photo,
    updated_at: new Date().toISOString()
  };

  return json(tasks[idx]);
};

export const DELETE: RequestHandler = async ({ params }) => {
  const idx = tasks.findIndex(t => t.id === params.id);
  if (idx === -1) throw error(404, 'Task not found');
  tasks.splice(idx, 1);
  return new Response(null, { status: 204 });
};
