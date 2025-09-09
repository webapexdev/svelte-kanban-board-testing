<script lang="ts">
    import { fade, scale } from "svelte/transition";

    export let open: boolean;
    export let title: string = "";
    export let onClose: () => void;
</script>

{#if open}
    <div
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        on:click={onClose}
        transition:fade={{ duration: 200 }}
    >
        <div
            class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative"
            on:click|stopPropagation
            transition:scale={{ duration: 200, start: 0.9 }}
        >
            <button
                class="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                on:click={onClose}
            >
                ✕
            </button>

            {#if title}
                <h2 class="text-lg font-semibold mb-4">{title}</h2>
            {/if}

            <slot />
        </div>
    </div>
{/if}
