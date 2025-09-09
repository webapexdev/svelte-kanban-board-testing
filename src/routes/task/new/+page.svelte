<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "$lib/components/Button.svelte";
  import FileUploader from "$lib/components/FileUploader.svelte";
  import { TaskInputSchema } from "$lib/schemas/task";
  import ArrowRight from "lucide-svelte/icons/arrow-right";

  let title = "";
  let description = "";
  let due_date = "";
  let photo: File | null = null;
  let errors: { title?: string; description?: string } = {};

  function handleFileChange(file: File | null) {
    photo = file;
  }

  async function submit() {
    errors = {};
    const result = TaskInputSchema.safeParse({ title, description });

    if (!result.success) {
      for (const err of result.error.issues) {
        if (err.path[0] === "title") errors.title = err.message;
        if (err.path[0] === "description") errors.description = err.message;
      }
      return;
    }

    const fd = new FormData();
    fd.append("title", title);
    if (description) fd.append("description", description);
    if (due_date) fd.append("due_date", due_date);
    if (photo) fd.append("photo", photo);

    await fetch("/api/tasks/", { method: "POST", body: fd });
    goto("/");
  }
</script>

<div class="p-6 max-w-lg mx-auto space-y-4 mt-10">
  <div class="flex w-full justify-between items-center">
    <h1 class="text-2xl font-bold">New Task</h1>
    <Button label="Go back" color="gray" on:click={() => goto("/")}>
      <ArrowRight class="w-6 h-6 text-gray-600" />
    </Button>
  </div>

  <input
    class="w-full border p-2 rounded"
    placeholder="Title"
    bind:value={title}
  />
  {#if errors.title}
    <p class="text-red-500 text-sm">{errors.title}</p>
  {/if}

  <textarea
    class="w-full border p-2 rounded"
    placeholder="Description"
    bind:value={description}
  ></textarea>
  {#if errors.description}
    <p class="text-red-500 text-sm">{errors.description}</p>
  {/if}

  <input type="date" class="w-full border p-2 rounded" bind:value={due_date} />

  <!-- Reusable file upload -->

  <div class="flex w-full justify-between items-center">
    <FileUploader
      on:change={(e: CustomEvent<File | null>) => handleFileChange(e.detail)}
    />
    <Button label="Create" color="blue" on:click={submit} />
  </div>
</div>
