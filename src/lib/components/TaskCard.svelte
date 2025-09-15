<script lang="ts">
	import type { Task } from '$lib/types/types';

	export let task: Task;
	export let setDraggingId: (id: string | null) => void;
</script>

<div
	role="listitem"
	aria-label={`Task: ${task.title}`}
	class="mb-2 cursor-move rounded border border-gray-200 bg-white p-3 shadow transition hover:shadow-md"
	draggable="true"
	on:dragstart={() => setDraggingId(task.id)}
	on:dragend={() => setDraggingId(null)}
>
	<a
		href={`/task/${task.id}`}
		class="font-semibold text-blue-600 hover:underline focus:ring-2 focus:ring-blue-400 focus:outline-none"
	>
		{task.title}
	</a>

	{#if task.due_date}
		<p class="text-sm text-gray-500">📅 Due: {task.due_date}</p>
	{/if}

	{#if task.description}
		<p class="truncate text-sm text-gray-600">{task.description}</p>
	{/if}
</div>
