<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import FileUploader from '$lib/components/FileUploader.svelte';
	import { TaskInputSchema } from '$lib/schemas/task';
	import Save from 'lucide-svelte/icons/save';

	export let id = '';
	export let title = '';
	export let description = '';
	export let due_date = '';
	export let photo: string = '';
	export let mode: 'new' | 'edit' = 'new'; // to differentiate between new and edit mode
	export let oncancel: () => void = () => {};

	let newPhoto: File | null = null;
	let errors: { title?: string; description?: string } = {};

	function handleFileChange(file: File | null) {
		newPhoto = file;
	}

	async function submit() {
		errors = {};
		const result = TaskInputSchema.safeParse({ title, description });

		if (!result.success) {
			for (const err of result.error.issues) {
				if (err.path[0] === 'title') errors.title = err.message;
				if (err.path[0] === 'description') errors.description = err.message;
			}
			return;
		}

		const fd = new FormData();
		fd.append('title', title);
		if (description) fd.append('description', description);
		if (due_date) fd.append('due_date', due_date);
		if (newPhoto) fd.append('photo', newPhoto);
		if (mode === 'new') {
			await fetch('/api/tasks/', { method: 'POST', body: fd });
		} else {
			await fetch(`/api/tasks/${id}`, {
				method: 'PUT',
				body: fd
			});
		}
		goto('/');
	}
</script>

<div class="mx-auto mt-10 max-w-lg space-y-4">
	<div class="mt-2">
		<label for="title" class="mb-1 block text-sm font-medium text-gray-700"> Title </label>
		<input class="w-full rounded border p-2" placeholder="Title" bind:value={title} />
		{#if errors.title}
			<p class="text-sm text-red-500">{errors.title}</p>
		{/if}
	</div>
	<div class="mt-2">
		<label for="description" class="mb-1 block text-sm font-medium text-gray-700">
			Description
		</label>
		<textarea
			class="w-full rounded border p-2"
			placeholder="Description"
			rows={5}
			bind:value={description}
		></textarea>
		{#if errors.description}
			<p class="text-sm text-red-500">{errors.description}</p>
		{/if}
	</div>
	<div class="mt-2">
		<label for="due_date" class="mb-1 block text-sm font-medium text-gray-700"> due date </label>
		<input type="date" class="w-full rounded border p-2" bind:value={due_date} />
	</div>

	<!-- show existing photo if user hasn’t selected new one -->
	{#if photo && !newPhoto}
		<div>
			<label class="mb-1 block text-sm font-medium text-gray-700"> Attachment </label>
			<img src={photo} alt="attachment" class="max-h-40 rounded" />
		</div>
	{/if}
	<div class="mt-2 flex w-full items-center justify-between">
		<FileUploader on:change={(e: CustomEvent<File | null>) => handleFileChange(e.detail)} />
		<div>
			{#if mode === 'edit'}
				<Button label="Cancel" color="gray" on:click={oncancel} />
			{/if}
			<Button label="Save" color="blue" on:click={submit}>
				<Save class="h-5 w-5" />
			</Button>
		</div>
	</div>
</div>
