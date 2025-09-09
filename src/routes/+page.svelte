<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import Column from '$lib/components/Column.svelte';
	import type { ColumnLabel, Task, ViewMode } from '$lib/types/types';
	import Plus from 'lucide-svelte/icons/plus';
	import List from 'lucide-svelte/icons/list';
	import LayoutKanban from 'lucide-svelte/icons/kanban';

	let tasks: Task[] = [];
	let nearest: Task | null = null;
	let view: ViewMode = 'list';
	let draggingId: string | null = null;

	async function load() {
		const resTasks = await fetch('/api/tasks/');
		tasks = await resTasks.json();
		const resNearest = await fetch('/api/tasks/nearest-deadline/');
		nearest = await resNearest.json();
	}

	async function moveTask(id: string, status: Task['status']) {
		const idx = tasks.findIndex((t) => t.id === id);
		if (idx === -1) return;
		const old = tasks[idx];
		tasks[idx] = { ...old, status };
		try {
			const fd = new FormData();
			fd.append('status', status);

			await fetch(`/api/tasks/${id}`, {
				method: 'PUT',
				body: fd
			});
		} catch (e) {
			// rollback if request fails
			tasks[idx] = old;
		}
	}

	function handleClick(e: CustomEvent<string>) {
		const label = e.detail;
		switch (label) {
			case 'List':
				view = 'list';
				break;
			case 'Kanban':
				view = 'kanban';
				break;
			case 'Add Task':
				// Navigate to add task page
				window.location.href = '/task/new';
				break;
		}
	}

	onMount(load);
</script>

<div class="flex h-screen flex-col space-y-6 p-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold">Dashboard</h1>
		<div class="flex items-center gap-2">
			<Button label="Add Task" color="blue" on:click={handleClick}>
				<Plus class="h-5 w-5" />
			</Button>
			<Button label="List" color="green" showLabel={false} on:click={handleClick}>
				<List class="h-5 w-5" />
			</Button>
			<Button label="Kanban" color="red" showLabel={false} on:click={handleClick}>
				<LayoutKanban class="h-5 w-5" />
			</Button>
		</div>
	</div>

	{#if nearest && nearest.title}
		<div class="mt-4 rounded-xl bg-yellow-100 p-4 shadow">
			<h2 class="font-semibold">Nearest deadline:</h2>
			<p>{nearest.title} (due {nearest.due_date})</p>
		</div>
	{/if}

	{#if view === 'list'}
		<div class="mt-4 grid gap-4">
			{#each tasks as t}
				<div class="rounded border border-gray-200 bg-white p-4 shadow">
					<a href={`/task/${t.id}`} class="font-semibold">{t.title}</a>
					{#if t.due_date}
						<p class="text-sm text-gray-500">Due: {t.due_date}</p>
					{/if}
					{#if t.description}
						<p class="truncate text-sm text-gray-600">{t.description}</p>
					{/if}
					<p class="text-xs text-gray-400">Status: {t.status}</p>
				</div>
			{/each}
		</div>
	{:else}
		<div class="mt-4 flex-1 overflow-hidden">
			<div class="grid h-full grid-cols-3 gap-4">
				{#each ['todo', 'in-progress', 'done'] as colTyped}
					<Column
						col={colTyped as ColumnLabel}
						{tasks}
						{moveTask}
						{draggingId}
						setDraggingId={(id) => (draggingId = id)}
					/>
				{/each}
			</div>
		</div>
	{/if}
</div>
