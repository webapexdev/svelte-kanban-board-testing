<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import ArrowRight from 'lucide-svelte/icons/arrow-right';
	import Edit from 'lucide-svelte/icons/edit';
	import Trash from 'lucide-svelte/icons/trash-2';
	import TaskForm from '$lib/components/TaskForm.svelte';

	let task: any = null;
	let editing = false;
	let deleting = false;
	let title = '';
	let description = '';
	let due_date = '';
	let photo: File | null = null;

	async function load() {
		const res = await fetch(`/api/tasks/${$page.params.id}`);
		task = await res.json();
		title = task.title;
		description = task.description || '';
		// existing photo is stored in DB as URL, not as File
		photo = null;
		due_date = task.due_date || '';
	}

	async function handleDelete() {
		await fetch(`/api/tasks/${task.id}`, { method: 'DELETE' });
		goto('/');
	}

	onMount(load);
</script>

{#if task}
	<div class="mx-auto mt-20 flex min-h-[400px] max-w-lg flex-col p-6">
		<div class="flex-1 space-y-4">
			{#if editing}
				<div class="space-y-4">
					<TaskForm
						{title}
						{description}
						{due_date}
						photo={task.photo}
						mode="edit"
						id={task.id}
						oncancel={() => (editing = false)}
					/>
				</div>
			{:else}
				<div class="flex w-full justify-between">
					<h1 class="text-2xl font-bold">{task.title}</h1>
					<Button label="Go to Dashboard" color="gray" on:click={() => goto('/')}>
						<ArrowRight class="h-6 w-6 text-gray-600" />
					</Button>
				</div>

				{#if task.due_date}
					<p class="text-sm text-gray-500">Due: {task.due_date}</p>
				{/if}

				<p>{task.description}</p>

				{#if task.photo}
					<img src={task.photo} alt="attachment" class="mt-2 rounded" />
				{/if}
			{/if}
		</div>

		<!-- Button group always at bottom -->
		{#if !editing}
			<div class="mt-6 flex justify-between border-t pt-4">
				<Button label="Edit" color="blue" on:click={() => (editing = true)}>
					<Edit class="h-5 w-5" />
				</Button>
				<Button label="Delete" color="red" on:click={() => (deleting = true)}>
					<Trash class="h-5 w-5" />
				</Button>
			</div>
		{/if}
	</div>

	<Modal open={deleting} title="Confirm Delete" onClose={() => (deleting = false)}>
		<p class="mb-4 text-gray-700">
			Are you sure you want to delete <span class="font-semibold">{task.title}</span>? This action
			cannot be undone.
		</p>

		<div class="flex w-full justify-between">
			<Button label="Cancel" color="gray" on:click={() => (deleting = false)} />
			<Button label="Yes, Delete" color="red" on:click={handleDelete} />
		</div>
	</Modal>
{/if}
