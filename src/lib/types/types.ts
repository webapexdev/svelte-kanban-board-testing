export type TaskStatus = "todo" | "in-progress" | "done";

export type Task = {
    id: string;
    title: string;
    description?: string;
    due_date?: string;   // ISO string or plain date
    photo?: string;      // URL
    status: TaskStatus;
};

export type ColumnLabel = "todo" | "in-progress" | "done"

export type ViewMode = "list" | "kanban";

export type Color = "blue" | "green" | "red" | "gray";