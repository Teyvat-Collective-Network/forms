<script>
  import { token } from '../stores.js';

  import Form from './form.svelte';

  let data = { forms: [], canCreate: false };
  let query = '';
  
  fetch('api/forms', $token ? {
    headers: { 'Authorization': $token },
  } : {}).then(async res => data = await res.json());
</script>


<div class="header">
  <input class="search" placeholder="Search.." bind:value={query} type="text">
  {#if data.canCreate}
    <a class="button new" href="/#/edit/new">New Form</a>
  {/if}
</div>

<div class="forms">
  {#each data.forms.filter(form => form.name.includes(query) || form.description.includes(query)) as form}
    <Form {form}/>
  {/each}
</div>


<style>
  .header {
    display: flex;
    gap: 8px;
    margin: 16px 0px;
  }

  .search {
    flex-grow: 1;
    background-color: var(--bg-contrast);
    border: none;
    outline: none;
    border-radius: 4px;
    font-size: 20px;
    padding: 8px 16px;
    color: var(--txt-main);
  }

  .button {
    padding: 12px 24px;
    border-radius: 4px;
    background-color: var(--col-dark);
    color: #fff;
    cursor: pointer;
    transition: .15s;
  }
  .button:hover {
    background-color: var(--col-mid);
  }

  .forms {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 32px;
  }
</style>