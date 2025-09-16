<script lang="ts">
	import { loading } from '$lib/stores/ui';
	import { fade, scale } from 'svelte/transition';
	import { derived } from 'svelte/store';

	// derived store to toggle visibility
	const show = derived(loading, ($loading) => $loading);
</script>

{#if $show}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
		transition:fade
	>
		<div class="flex flex-col items-center space-y-2 rounded-lg bg-white/90 p-6 shadow-lg">
			<!-- Spinner -->
			<div
				class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500"
			></div>
			<p class="font-medium text-gray-700">Loading...</p>
		</div>
	</div>
{/if}

<style>
	/* optional smoother spin */
	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
	.animate-spin {
		animation: spin 1s linear infinite;
	}
</style>
