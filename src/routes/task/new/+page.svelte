<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import TaskForm from '$lib/components/TaskForm.svelte';
	import ArrowRight from 'lucide-svelte/icons/arrow-right';
</script>

<div class="mx-auto mt-10 max-w-lg space-y-6 p-6">
	<header class="flex w-full items-center justify-between">
		<h1 class="text-2xl font-bold">New Task</h1>
		<Button label="Go to Dashboard" color="gray" on:click={() => goto('/')}>
			<ArrowRight class="h-6 w-6 text-gray-600" />
		</Button>
	</header>

	<TaskForm mode="new" />
</div>
