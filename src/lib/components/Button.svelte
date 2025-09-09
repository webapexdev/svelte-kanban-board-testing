<script lang="ts">
	import type { Color } from '$lib/types/types';
	import { createEventDispatcher } from 'svelte';
	export let label: string = '';
	export let color: Color = 'gray';

	const dispatch = createEventDispatcher<{ click: string }>();

	function handleClick() {
		dispatch('click', label);
	}

	const colorClasses: Record<typeof color, string> = {
		blue: 'bg-blue-500 hover:bg-blue-600 text-white',
		green: 'bg-green-500 hover:bg-green-600 text-white',
		red: 'bg-red-500 hover:bg-red-600 text-white',
		gray: 'bg-gray-200 hover:bg-gray-300 text-black'
	};
</script>

<div class="inline-block">
	<button
		on:click={handleClick}
		class={`cursor-pointer rounded px-3 py-1 transition ${colorClasses[color]} line-height-0 flex h-10 items-center gap-2 border-0 focus:ring-2 focus:ring-offset-2 focus:outline-none focus:ring-${color}-500`}
	>
		{#if label}
			<span class="flex items-center">{label}</span>
		{/if}
		<slot />
	</button>
</div>
