import { json } from '@sveltejs/kit';
import { tasks } from '$lib/server/db';
import type { RequestHandler } from './$types';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

export const POST: RequestHandler = async ({ request }) => {
  const form = await request.formData();
  const title = form.get('title') as string;
  const description = form.get('description') as string | null;
  const due_date = form.get('due_date') as string | null;
  const file = form.get('photo') as File | null;

  let photo: string | undefined;
  if (file && file.size > 0) {
    // ensure /static/uploads exists
    const uploadDir = path.join(process.cwd(), 'static', 'uploads');
    fs.mkdirSync(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(uploadDir, filename);

    fs.writeFileSync(filepath, buffer);
    photo = `/uploads/${filename}`;
  }

  const task = {
    id: randomUUID(),
    title,
    description: description || undefined,
    due_date: due_date || undefined,
    photo,
    status: 'todo' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  tasks.push(task);
  return json(task, { status: 201 });
};

export const GET: RequestHandler = async ({ url }) => {
  try {
    const status = url.searchParams.get('status');
    const q = url.searchParams.get('q');

    let filtered = tasks;

    if (status && ['todo', 'in-progress', 'done'].includes(status)) {
      filtered = filtered.filter((t) => t.status === status);
    }

    if (q && q.trim() !== '') {
      const query = q.toLowerCase();
      filtered = filtered.filter((t) => {
        const title = t.title ?? '';
        const description = t.description ?? '';
        return (
          title.toLowerCase().includes(query) ||
          description.toLowerCase().includes(query)
        );
      });
    }

    return json(filtered);
  } catch (err) {
    console.error('Error in GET /api/tasks:', err);
    return json({ error: 'Internal Server Error' }, { status: 500 });
  }
};