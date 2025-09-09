<script lang="ts">
  import type { Task } from "$lib/types/types";

  export let task: Task;
  export let setDraggingId: (id: string | null) => void;
</script>

<div
  class="p-3 bg-white rounded shadow mb-2 cursor-move border border-gray-200"
  draggable="true"
  on:dragstart={() => setDraggingId(task.id)}
  on:dragend={() => setDraggingId(null)}
>
  <a href={`/task/${task.id}`} class="font-semibold">{task.title}</a>
  {#if task.due_date}
    <p class="text-sm text-gray-500">Due: {task.due_date}</p>
  {/if}
  {#if task.description}
    <p class="text-sm text-gray-600 truncate">{task.description}</p>
  {/if}
</div>
