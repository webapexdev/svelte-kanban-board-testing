<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from './Button.svelte';

	const dispatch = createEventDispatcher<{ change: { file: File | null } }>();

	let fileInput: HTMLInputElement | null = null;
	let file: File | null = null;

	function openFileDialog() {
		fileInput?.click();
	}

	function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			file = target.files[0];
			dispatch('change', file); // ✅ dispatch is "change"
		} else {
			file = null;
			dispatch('change', null);
		}
	}
</script>

<div class="flex items-center gap-2">
	<!-- Hidden input -->
	<input
		type="file"
		accept="image/*"
		bind:this={fileInput}
		on:change={handleFileChange}
		hidden
		aria-hidden="true"
	/>

	<!-- Upload button triggers hidden input -->
	<Button
		label="Upload Image"
		color="red"
		on:click={openFileDialog}
		aria-label="Upload an image file"
	/>

	<!-- File name -->
	{#if file}
		<p class="max-w-[200px] truncate text-sm text-gray-600" title={file.name}>
			{file.name}
		</p>
	{/if}
</div>
