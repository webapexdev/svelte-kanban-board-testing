import { writable, get } from "svelte/store";
import type { Task } from "$lib/types/types";

export const tasks = writable<Task[]>([]);
export const nearest = writable<Task | null>(null);

//
// Fetch all tasks + nearest
//
export async function fetchTasks(params?: { status?: string; q?: string }) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const resTasks = await fetch(`/api/tasks?${query}`);
    const list = await resTasks.json();
    tasks.set(list);
    const resNearest = await fetch("/api/tasks/nearest-deadline/");
    nearest.set(await resNearest.json());
}

//
// Fetch single task by id (from cache if available)
//
export async function fetchTaskById(id: string): Promise<Task | null> {
    const cached = get(tasks).find((t) => t.id === id);
    if (cached) return cached;

    const res = await fetch(`/api/tasks/${id}`);
    if (!res.ok) return null;
    const t = await res.json();

    tasks.update((curr) => {
        if (!curr.find((x) => x.id === t.id)) return [...curr, t];
        return curr.map((x) => (x.id === t.id ? t : x));
    });

    return t;
}

//
// Create task
//
export async function createTask(fd: FormData): Promise<Task | null> {
    const res = await fetch("/api/tasks/", { method: "POST", body: fd });
    if (!res.ok) return null;
    const t = await res.json();

    tasks.update((curr) => [...curr, t]);
    return t;
}

//
// Update task
//
export async function updateTask(id: string, fd: FormData): Promise<Task | null> {
    const res = await fetch(`/api/tasks/${id}`, { method: "PUT", body: fd });
    if (!res.ok) return null;
    const t = await res.json();

    tasks.update((curr) => curr.map((x) => (x.id === id ? t : x)));
    return t;
}

//
// Delete task
//
export async function deleteTask(id: string) {
    // optimistic update
    const prev = get(tasks);
    tasks.update((curr) => curr.filter((t) => t.id !== id));

    try {
        const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Delete failed");
    } catch (e) {
        // rollback
        tasks.set(prev);
        throw e;
    }
}

//
// Move task (status change)
//
export async function moveTask(id: string, status: Task["status"]) {
    const all = get(tasks);
    const idx = all.findIndex((t) => t.id === id);
    if (idx === -1) return;

    const old = all[idx];
    const updated = { ...old, status };

    // optimistic update
    tasks.update((curr) => curr.map((t) => (t.id === id ? updated : t)));

    try {
        const fd = new FormData();
        fd.append("status", status);
        await fetch(`/api/tasks/${id}`, { method: "PUT", body: fd });
    } catch (e) {
        // rollback
        tasks.update((curr) => curr.map((t) => (t.id === id ? old : t)));
    }
}
