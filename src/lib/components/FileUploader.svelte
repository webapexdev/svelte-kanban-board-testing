<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Button from "./Button.svelte";

    const dispatch = createEventDispatcher<{ change: File | null }>();

    let fileInput: HTMLInputElement;
    let file: File | null = null;

    function openFileDialog() {
        fileInput.click();
    }

    function handleFileChange(e: Event) {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            file = target.files[0];
            dispatch("change", file);
        } else {
            file = null;
            dispatch("change", null);
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
    />

    <!-- Upload button -->

    <Button label="Upload Image" color="red" on:click={openFileDialog} />
    <!-- File name (ellipsis) -->
    {#if file}
        <p class="max-w-[200px] truncate text-sm text-gray-600">{file.name}</p>
    {/if}
</div>
