<script>
  import { path } from '../stores.js';

  export let form;
</script>


<div class="form">
  <h2 class="name">{form.name}</h2>
  <p class="description">{form.description}</p>
  <div class="buttons" class:edit={form.canEdit}>
    <a on:click={() => $path = `/form/${form._id}`} class="button" href="#/form/{form._id}">Submit</a>
    {#if form.canEdit}
      <a on:click={() => $path = `/edit/${form._id}`} class="button" href="#/edit/{form._id}">Edit</a>
    {/if}
  </div>
</div>


<style>
  .form {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--bg-contrast);
    gap: 8px;
    padding: 8px;
    border-radius: 4px;
  }

  .description {
    white-space: pre-line;
    flex-grow: 1;
  }
  
  .buttons {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
  }
  .buttons.edit {
    grid-template-columns: 1fr 1fr;
  }

  .button {
    display: flex;
    justify-content: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 4px;
    background-color: var(--col-dark);
    color: #fff;
    cursor: pointer;
    transition: .15s;
  }
  .button:hover {
    background-color: var(--col-mid);
  }
</style>