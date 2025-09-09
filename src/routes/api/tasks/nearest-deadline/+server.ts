import { json } from '@sveltejs/kit';
import { tasks } from '$lib/server/db';

export const GET = async () => {
  const upcoming = tasks
    .filter(t => t.due_date)
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())[0];
  return json(upcoming || {});
};
