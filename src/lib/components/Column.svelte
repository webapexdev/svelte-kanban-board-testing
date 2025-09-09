<script lang="ts">
	import type { Task, ColumnLabel } from '$lib/types/types';
	import TaskCard from './TaskCard.svelte'; // adjust path if needed

	export let col: ColumnLabel;
	export let tasks: Task[] = [];
	export let moveTask: (id: string, status: Task['status']) => void;
	export let draggingId: string | null;
	export let setDraggingId: (id: string | null) => void;
</script>

<div
	class="flex min-h-[300px] flex-col overflow-auto rounded-lg border border-gray-300 bg-gray-100 p-4 shadow"
	on:dragover|preventDefault
	on:drop={() => {
		if (draggingId) moveTask(draggingId, col);
	}}
>
	<h2 class="mb-2 font-semibold capitalize">
		{col.replace('-', ' ')}
	</h2>

	<div class="flex-1">
		{#each tasks.filter((t) => t.status === col) as t}
			<TaskCard {setDraggingId} task={t} />
		{/each}
	</div>
</div>
