<script lang="ts">
	import type { Color } from '$lib/types/types';
	import { createEventDispatcher } from 'svelte';

	export let label: string = '';
	export let color: Color = 'gray';

	// Event dispatcher with clearer typing
	const dispatch = createEventDispatcher<{ click: { label: string } }>();

	function handleClick() {
		dispatch('click', { label });
	}

	// Use Color type for keys, and include focus ring per color
	const colorClasses: Record<Color, string> = {
		blue: 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500',
		green: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500',
		red: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500',
		gray: 'bg-gray-400 hover:bg-gray-500 hover:text-white text-black focus:ring-gray-600'
	};

	const baseClasses =
		'cursor-pointer rounded px-3 py-1 flex h-10 items-center gap-2 border-0 ' +
		'transition leading-none focus:ring-2 focus:ring-offset-2 focus:outline-none';
</script>

<div class="inline-block">
	<button on:click={handleClick} class={`${baseClasses} ${colorClasses[color]}`}>
		{#if label}
			<span class="flex items-center">{label}</span>
		{/if}
		<slot />
	</button>
</div>
