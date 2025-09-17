<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import FileUploader from '$lib/components/FileUploader.svelte';
	import { TaskInputSchema } from '$lib/schemas/task';
	import Save from 'lucide-svelte/icons/save';
	import { createTask, updateTask } from '$lib/stores/tasks';

	export let id: string = '';
	export let title: string = '';
	export let description: string = '';
	export let due_date: string = '';
	export let photo: string = '';
	export let mode: 'new' | 'edit' = 'new';
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
			await createTask(fd);
		} else {
			await updateTask(id, fd);
		}

		goto('/');
	}
</script>

<div class="mx-auto mt-10 max-w-lg space-y-4 rounded-lg bg-gray-400 p-6 shadow-lg">
	<div class="mt-2">
		<label for="title" class="mb-1 block text-sm font-medium text-gray-700">Title</label>
		<input
			id="title"
			type="text"
			class="w-full rounded border p-2 focus:ring focus:ring-blue-200"
			placeholder="Title"
			bind:value={title}
			aria-invalid={!!errors.title}
			aria-describedby="title-error"
		/>
		{#if errors.title}
			<p id="title-error" class="text-sm text-red-500">{errors.title}</p>
		{/if}
	</div>

	<div class="mt-2">
		<label for="description" class="mb-1 block text-sm font-medium text-gray-700">Description</label
		>
		<textarea
			id="description"
			class="w-full rounded border p-2 focus:ring focus:ring-blue-200"
			placeholder="Description"
			rows={5}
			bind:value={description}
			aria-invalid={!!errors.description}
			aria-describedby="description-error"
		></textarea>
		{#if errors.description}
			<p id="description-error" class="text-sm text-red-500">{errors.description}</p>
		{/if}
	</div>

	<div class="mt-2">
		<label for="due_date" class="mb-1 block text-sm font-medium text-gray-700">Due Date</label>
		<input
			id="due_date"
			type="date"
			class="w-full rounded border p-2 focus:ring focus:ring-blue-200"
			bind:value={due_date}
		/>
	</div>

	{#if photo && !newPhoto}
		<div>
			<label class="mb-1 block text-sm font-medium text-gray-700">Attachment</label>
			<img src={photo} alt="attachment" class="max-h-40 rounded" />
		</div>
	{/if}

	<div class="mt-2 flex w-full items-center justify-between">
		<FileUploader on:change={(e: CustomEvent<File | null>) => handleFileChange(e.detail)} />
		<div class="flex gap-2">
			{#if mode === 'edit'}
				<Button label="Cancel" color="gray" on:click={oncancel} />
			{/if}
			<Button data-testid="save-btn" label="Save" color="blue" on:click={submit}>
				<Save class="h-5 w-5" />
			</Button>
		</div>
	</div>
</div>
