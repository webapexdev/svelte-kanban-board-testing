<script lang="ts">
	import type { Task, ColumnLabel } from '$lib/types/types';
	import TaskCard from './TaskCard.svelte';

	export interface ColumnProps {
		col: ColumnLabel;
		tasks: Task[];
		moveTask: (id: string, status: Task['status']) => void;
		draggingId: string | null;
		setDraggingId: (id: string | null) => void;
	}

	export let col: ColumnLabel;
	export let tasks: Task[] = [];
	export let moveTask: ColumnProps['moveTask'];
	export let draggingId: ColumnProps['draggingId'];
	export let setDraggingId: ColumnProps['setDraggingId'];

	function handleDrop() {
		if (draggingId) moveTask(draggingId, col);
	}

	function formatLabel(label: ColumnLabel): string {
		return label.replace('-', ' ');
	}
</script>

<div
	class="flex min-h-[300px] flex-col overflow-auto rounded-lg border border-gray-300 bg-gray-100 p-4 shadow"
	on:dragover|preventDefault
	on:drop={handleDrop}
	role="list"
	aria-label={`Tasks in ${formatLabel(col)} column`}
>
	<h2 class="mb-2 font-semibold capitalize">
		{formatLabel(col)}
	</h2>

	<div class="flex-1 space-y-2">
		{#each tasks.filter((t) => t.status === col) as t (t.id)}
			<TaskCard {setDraggingId} task={t} role="listitem" />
		{/each}
	</div>
</div>
