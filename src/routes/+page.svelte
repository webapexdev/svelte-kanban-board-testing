<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import Column from '$lib/components/Column.svelte';
	import Plus from 'lucide-svelte/icons/plus';
	import List from 'lucide-svelte/icons/list';
	import LayoutKanban from 'lucide-svelte/icons/kanban';
	import TaskFilter from '$lib/components/TaskFilter.svelte';
	import { tasks, nearest, fetchTasks, moveTask } from '$lib/stores/tasks';
	import { filter } from '$lib/stores/filter';
	import type { ColumnLabel, ViewMode } from '$lib/types/types';
	import Loading from '$lib/components/Loading.svelte';
	import { viewMode } from '$lib/stores/ui';

	let draggingId: string | null = null;

	function handleClick(role: string) {
		switch (role) {
			case 'List':
				viewMode.set('list');
				break;
			case 'Kanban':
				viewMode.set('kanban');
				break;
			case 'Add Task':
				window.location.href = '/task/new';
				break;
		}
	}

	async function handleFilterChange(e: CustomEvent<{ status: string; q: string }>) {
		const currentFilter = e.detail; // ✅ get from store
		const params = new URLSearchParams();
		if (currentFilter.status) params.set('status', currentFilter.status);
		if (currentFilter.q) params.set('q', currentFilter.q);
		if (currentFilter.status || currentFilter.q) {
			history.replaceState(null, '', `?${params.toString()}`);
		} else {
			history.replaceState(null, '', window.location.pathname);
		}
		fetchTasks(e.detail);
	}

	onMount(() => {
		// ✅ parse filter from URL on first load
		const params = new URLSearchParams(window.location.search);
		const initial: TaskFilter = {
			status: (params.get('status') as TaskFilter['status']) || '',
			q: params.get('q') || ''
		};

		// update store so UI matches
		filter.set(initial);

		// fetch tasks based on parsed filter
		fetchTasks(initial);
	});
</script>

<div class="flex h-screen flex-col space-y-6">
	<div class="flex flex-wrap items-center justify-between gap-4 bg-black/70 p-6 backdrop-blur">
		<h1 class="text-2xl font-bold text-white">Dashboard</h1>
		<div class="flex flex-wrap items-center gap-4">
			<TaskFilter
				bind:status={$filter.status as ColumnLabel}
				bind:q={$filter.q}
				on:change={handleFilterChange}
			/>
			<div class="flex flex-shrink-0 items-center gap-2">
				<Button label="Add Task" color="blue" on:click={() => handleClick('Add Task')}>
					<Plus class="h-5 w-5" />
				</Button>
				<Button color="green" on:click={() => handleClick('List')}><List class="h-5 w-5" /></Button>
				<Button color="red" on:click={() => handleClick('Kanban')}>
					<LayoutKanban class="h-5 w-5" />
				</Button>
			</div>
		</div>
	</div>

	{#if $nearest}
		<div class="m-4 rounded-xl bg-yellow-100 p-4">
			<h2 class="font-semibold">Nearest deadline:</h2>
			<p>{$nearest.title} (due {$nearest.due_date})</p>
		</div>
	{/if}

	{#if $viewMode === 'list'}
		<div class="m-4 grid gap-4">
			{#each $tasks as t}
				<div class="rounded border border-gray-200 bg-white p-4 shadow">
					<a href={`/task/${t.id}`} class="font-semibold">{t.title}</a>
					{#if t.due_date}<p class="text-sm text-gray-500">Due: {t.due_date}</p>{/if}
					{#if t.description}<p class="truncate text-sm text-gray-600">{t.description}</p>{/if}
					<p class="text-xs text-gray-400">Status: {t.status}</p>
				</div>
			{/each}
		</div>
	{:else}
		<div class="m-4 flex-1">
			<div class="grid h-full grid-cols-1 gap-4 md:grid-cols-3">
				{#each ['todo', 'in-progress', 'done'] as colTyped}
					<Column
						col={colTyped as ColumnLabel}
						tasks={$tasks}
						{moveTask}
						{draggingId}
						setDraggingId={(id) => (draggingId = id)}
					/>
				{/each}
			</div>
		</div>
	{/if}
</div>
<Loading />
