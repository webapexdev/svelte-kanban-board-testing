<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';

	export let open: boolean;
	export let title: string = '';

	const dispatch = createEventDispatcher<{ close: void }>();

	function requestClose() {
		dispatch('close');
	}

	// Close on ESC
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			requestClose();
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
	});
	onDestroy(() => {
		window.removeEventListener('keydown', handleKeydown);
	});
</script>

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
		on:click={requestClose}
		role="dialog"
		aria-modal="true"
		aria-label={title}
		transition:fade={{ duration: 200 }}
	>
		<div
			class="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
			on:click|stopPropagation
			transition:scale={{ duration: 200, start: 0.9 }}
		>
			<button
				class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
				on:click={requestClose}
				aria-label="Close modal"
			>
				✕
			</button>

			{#if title}
				<h2 class="mb-4 text-lg font-semibold">{title}</h2>
			{/if}

			<slot />
		</div>
	</div>
{/if}
