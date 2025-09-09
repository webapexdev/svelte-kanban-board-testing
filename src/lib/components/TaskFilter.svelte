<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let status: string = '';
	export let q: string = '';

	const dispatch = createEventDispatcher<{
		change: { status: string; q: string };
	}>();

	function updateStatus(e: Event) {
		const value = (e.target as HTMLSelectElement).value;
		dispatch('change', { status: value, q });
	}

	function updateQuery(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		dispatch('change', { status, q: value });
	}
</script>

<div class="flex items-center gap-3 rounded-lg bg-gray-50 p-3 shadow-sm">
	<select
		class="rounded border-gray-300 px-2 py-1 text-sm"
		on:change={updateStatus}
		bind:value={status}
	>
		<option value="">All</option>
		<option value="todo">Todo</option>
		<option value="in-progress">In Progress</option>
		<option value="done">Done</option>
	</select>

	<input
		type="text"
		placeholder="Search tasks..."
		class="flex-1 rounded border-gray-300 px-2 py-1 text-sm"
		on:input={updateQuery}
		bind:value={q}
	/>
</div>
