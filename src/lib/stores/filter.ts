import { writable } from "svelte/store";

export type TaskFilter = {
    status: "" | "todo" | "in-progress" | "done";
    q: string;
};

// initial state
export const filter = writable<TaskFilter>({
    status: "",
    q: ""
});
