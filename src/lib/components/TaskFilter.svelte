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

<div class="flex h-10 flex-shrink-0 items-center gap-3 p-0" role="search" aria-label="Task filter">
	<label class="sr-only" for="status-filter">Filter by status</label>
	<div class="relative h-full">
		<select
			id="status-filter"
			class="h-full appearance-none rounded border-gray-300 bg-black/30 px-2 py-1 pr-8 text-sm text-white focus:border-blue-500 focus:ring focus:ring-blue-200"
			on:change={updateStatus}
			bind:value={status}
		>
			<option value="">All</option>
			<option value="todo">Todo</option>
			<option value="in-progress">In Progress</option>
			<option value="done">Done</option>
		</select>
		<svg
			class="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-white"
			fill="none"
			stroke="white"
			viewBox="0 0 24 24"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
		</svg>
	</div>
	<!-- Custom arrow -->
	<label class="sr-only" for="task-search">Search tasks</label>
	<input
		id="task-search"
		type="search"
		autocomplete="off"
		placeholder="Search tasks..."
		class="h-full flex-1 rounded border border-gray-300 bg-black/30 px-2 py-1 text-sm text-white focus:border-blue-600 focus:ring focus:ring-blue-200"
		on:input={updateQuery}
		bind:value={q}
	/>
</div>
