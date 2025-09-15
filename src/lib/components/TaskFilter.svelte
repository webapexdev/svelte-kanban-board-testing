<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let status: 'todo' | 'in-progress' | 'done' | '' = '';
	export let q: string = '';

	const dispatch = createEventDispatcher<{
		change: { status: typeof status; q: string };
	}>();

	function updateStatus(e: Event) {
		const value = (e.target as HTMLSelectElement).value as typeof status;
		dispatch('change', { status: value, q });
	}

	function updateQuery(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		dispatch('change', { status, q: value });
	}
</script>

<div
	class="flex items-center gap-3 rounded-lg bg-gray-50 p-3 shadow-sm"
	role="search"
	aria-label="Task filter"
>
	<label class="sr-only" for="status-filter">Filter by status</label>
	<select
		id="status-filter"
		class="rounded border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
		on:change={updateStatus}
		bind:value={status}
	>
		<option value="">All</option>
		<option value="todo">Todo</option>
		<option value="in-progress">In Progress</option>
		<option value="done">Done</option>
	</select>

	<label class="sr-only" for="task-search">Search tasks</label>
	<input
		id="task-search"
		type="search"
		placeholder="Search tasks..."
		class="flex-1 rounded border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
		on:input={updateQuery}
		bind:value={q}
	/>
</div>
