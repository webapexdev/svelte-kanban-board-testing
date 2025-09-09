<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import Button from "$lib/components/Button.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import FileUploader from "$lib/components/FileUploader.svelte";
  import ArrowRight from "lucide-svelte/icons/arrow-right";
  import Edit from "lucide-svelte/icons/edit";
  import Trash from "lucide-svelte/icons/trash-2";
  import Save from "lucide-svelte/icons/save";

  let task: any = null;
  let editing = false;
  let deleting = false;
  let title = "";
  let description = "";
  let photo: File | null = null;

  async function load() {
    const res = await fetch(`/api/tasks/${$page.params.id}`);
    task = await res.json();
    title = task.title;
    description = task.description || "";
    // existing photo is stored in DB as URL, not as File
    photo = null;
  }

  async function save() {
    const fd = new FormData();
    fd.append("title", title);
    fd.append("description", description);

    if (photo) {
      fd.append("photo", photo);
    }

    const res = await fetch(`/api/tasks/${task.id}`, {
      method: "PUT",
      body: fd,
    });

    task = await res.json();
    editing = false;
    goto("/");
  }

  async function handleDelete() {
    await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
    goto("/");
  }

  function handleFileChange(file: File | null) {
    photo = file;
  }

  onMount(load);
</script>

{#if task}
  <div class="p-6 max-w-lg mx-auto mt-20 min-h-[400px] flex flex-col">
    <div class="flex-1 space-y-4">
      {#if editing}
        <div class="space-y-4">
          <div>
            <label
              for="title"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              class="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              bind:value={title}
            />
          </div>

          <div>
            <label
              for="description"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              class="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="5"
              bind:value={description}
            ></textarea>
          </div>

          <!-- ✅ Reusable FileUploader component -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Attachment
            </label>
            <FileUploader on:change={(e) => handleFileChange(e.detail)} />

            {#if task.photo && !photo}
              <!-- show existing photo if user hasn’t selected new one -->
              <img
                src={task.photo}
                alt="attachment"
                class="rounded mt-2 max-h-40"
              />
            {/if}
          </div>
        </div>
      {:else}
        <div class="flex justify-between w-full">
          <h1 class="text-2xl font-bold">{task.title}</h1>
          <Button
            label="Go to Dashboard"
            color="gray"
            on:click={() => goto("/")}
          >
            <ArrowRight class="w-6 h-6 text-gray-600" />
          </Button>
        </div>

        {#if task.due_date}
          <p class="text-sm text-gray-500">Due: {task.due_date}</p>
        {/if}

        <p>{task.description}</p>

        {#if task.photo}
          <img src={task.photo} alt="attachment" class="rounded mt-2" />
        {/if}
      {/if}
    </div>

    <!-- Button group always at bottom -->
    <div class="flex justify-between border-t pt-4 mt-6">
      {#if editing}
        <Button label="Save" color="green" on:click={save}>
          <Save class="w-5 h-5" />
        </Button>
        <Button
          label="Cancel"
          color="gray"
          on:click={() => (editing = false)}
        />
      {:else}
        <Button label="Edit" color="blue" on:click={() => (editing = true)}>
          <Edit class="w-5 h-5" />
        </Button>
        <Button label="Delete" color="red" on:click={() => (deleting = true)}>
          <Trash class="w-5 h-5" />
        </Button>
      {/if}
    </div>
  </div>

  <Modal
    open={deleting}
    title="Confirm Delete"
    onClose={() => (deleting = false)}
  >
    <p class="mb-4 text-gray-700">
      Are you sure you want to delete <span class="font-semibold"
        >{task.title}</span
      >? This action cannot be undone.
    </p>

    <div class="flex justify-between w-full">
      <Button label="Cancel" color="gray" on:click={() => (deleting = false)} />
      <Button label="Yes, Delete" color="red" on:click={handleDelete} />
    </div>
  </Modal>
{/if}
