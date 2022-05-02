<script>
  import { path, token } from '../stores.js';

  import Preview from './preview.svelte';
  import Editor from './editor.svelte';
  import Responses from './responses.svelte';
  import Error from '../components/error.svelte';
  import Modal from '../components/modal.svelte';

  export let parts;

  let currentTab = parts[1] || 'editor';
  let showRequired = false;
  let dropdownOpen = false;
  let dropdown;
  let modalMode;
  let saved = false;

  $: console.log(dropdownOpen, dropdown?.scrollHeight);

  const tabs = {
    preview: Preview,
    editor: Editor,
    responses: Responses,
  };

  let form;
  let json;

  if (!$token) {
    form = {
      statusCode: 401,
      error: 'Unauthorized',
      message: 'You are not logged in',
    }
  } else if (parts[0] === 'new') {
    form = {
      name: '',
      description: '',
      stages: [],
      access: {
        view: { users: [], perms: 0, everyone: true },
        edit: { users: [], perms: 0 }
      },
    }
  } else {
    fetch(`/api/forms/${parts[0]}`, {
      headers: { 'Authorization': $token },
    }).then(async res => form = await res.json());
  }


  async function submit() {
    console.log(form);
    if (!validate()) return showRequired = true;
    if (parts[0] === 'new') {
      const res = await fetch('api/forms', {
        method: 'POST',
        body: JSON.stringify(form),
        headers: {
          'Content-Type': 'application/json',
          Authorization: $token,
        },
      });
      const data = await res.json();
      if (data.error) return form = data;
      saved = true;
      setTimeout(() => saved = false, 1500);
      return $path = `/edit/${data._id}`;
    }

    const res = await fetch('api/forms/' + parts[0], {
      method: 'PATCH',
      body: JSON.stringify(form),
      headers: {
        'Content-Type': 'application/json',
        Authorization: $token,
      },
    });
    const data = await res.json().catch(() => {});
    if (data?.error) return form = data;
    saved = true;
    setTimeout(() => saved = false, 1500);
  }


  function validate() {
    if (!form.name || !form.stages.length) return false;
    return form.stages.every(stage =>
      stage.name &&
      stage.fields.length &&
      stage.fields.every(field =>
        field.name &&
        (['text', 'none', 'checkbox'].includes(field.type) || field.options?.length && field.options.every(o=>o))
    ));
  }


  function resetJSON() {
    json = JSON.stringify(form, filter, 2);
  }


  function filter(k, v) {
    return [
      '__v',
      '_id',
      'author',
      'canEdit',
    ].includes(k) ? undefined : v;
  }


  function editJSON() {
    modalMode = 'json';
    resetJSON();
    document.getElementById('modal').classList.add('open');
  }

  function cancelJSON() {
    document.getElementById('modal').classList.remove('open');
  }

  function patchJSON() {
    const data = JSON.parse(json);
    form = {
      ...form,
      ...data,
    };
    document.getElementById('modal').classList.remove('open');
  }


  function delModal() {
    modalMode = 'delete';
    document.getElementById('modal').classList.add('open');
  }

  function del() {
    fetch('/api/forms/' + parts[0], {
      method: 'DELETE',
      headers: { Authorization: $token },
    });
    $path = '/list';
  }
</script>


{#if form?.error}
<Error error={form}/>

{:else if form}
<div class="header">
  {#each Object.keys(tabs) as tab}
    <a class="link" class:missing={showRequired && tab === 'editor' && !validate()} class:active={tab === currentTab} on:click={() => $path = `/edit/${parts[0]}/${currentTab = tab}`} href="#/edit/{parts[0]}/{tab}">{tab}</a>
  {/each}
  {#if currentTab !== 'responses'}
    <div class="right">
      <div on:click={() => $path = '/list'} class="button">Cancel</div>
      <div on:click={submit} class="button" class:saved={saved}>{saved ? 'Saved!' : 'Save'}</div>
      <div on:click={() => dropdownOpen = !dropdownOpen} class="burger fa-solid fa-bars"></div>
    </div>
    <div class="dropdown" class:open={dropdownOpen} bind:this={dropdown} style="max-height: {dropdownOpen ? dropdown?.scrollHeight + 16 : 0}px;">
      <div class="option" on:click={editJSON}>JSON Editor</div>
      {#if parts[0] !== 'new'}
        <hr>
        <div class="option" style="color: red" on:click={delModal}>Delete Form</div>
      {/if}
    </div>
  {/if}
</div>

<Modal id="modal">
  {#if modalMode === 'json'}
    <textarea bind:value={json}></textarea>
    <div class="buttons">
      <div class="button" on:click={cancelJSON}>Cancel</div>
      <div class="button" on:click={patchJSON}>Save</div>
    </div>
  {:else if modalMode === 'delete'}
    <h2>Are you sure you want to delete "{form.name}"?</h2>
    <div class="buttons">
      <div class="button" on:click={() => document.getElementById('modal').classList.remove('open')}>Cancel</div>
      <div class="button" on:click={del}>Confirm</div>
    </div>
  {/if}
</Modal>

<svelte:component this={tabs[currentTab]} {form} {showRequired}/>

{/if}


<style>
  .header {
    position: relative;
    display: flex;
    align-items: center;
    gap: 32px;
    margin-bottom: 16px;
  }

  .link {
    padding: 12px 0px;
    font-size: 24px;
    justify-self: flex-end;
    border-style: solid;
    border-width: 4px 0px;
    border-color: transparent;
  }
  .link.active {
    color: var(--txt-contrast);
    border-bottom-color: var(--txt-contrast);
  }

  .link.missing:not(.active) {
    border-bottom-color: red;
  }

  .right {
    flex-grow: 1;
    display: flex;
    justify-content: end;
    align-items: center;
    gap: 16px;
  }

  .button {
    position: relative;
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

  .burger {
    cursor: pointer;
    padding: 4px;
    margin-right: 12px;
    display: inline-block;
    box-sizing: border-box;
    font-size: 24px;
    color: var(--col-mid);
    transition: .15s;
  }
  .burger:hover {
    color: var(--txt-main);
  }

  .dropdown {
    position: absolute;
    right: 16px;
    top: 64px;
    z-index: 5;
    box-sizing: border-box;
    background-color: var(--bg-main);
    overflow: hidden;
    border-radius: 4px;
    transition: .15s;
    border: solid var(--col-light);
    border-width: 0px 1px;
  }
  .dropdown.open {
    border-width: 1px;
  }

  .dropdown hr {
    height: 1px;
    background-color: var(--col-light);
    border: none;
    margin: 0px;
  }

  .option {
    cursor: pointer;
    padding: 4px 8px;
  }
  .option:hover {
    background-color: var(--col-light);
  }

  textarea {
    background-color: var(--bg-contrast);
    color: var(--txt-main);
    height: 512px;
    resize: none;
    border: 1px solid var(--col-mid);
    border-radius: 4px;
    padding: 8px;
    width: 512px;
    box-sizing: border-box;
    flex-shrink: 0;
    font-family: monospace;
    font-size: 16px;
    outline: none;
  }
  textarea:focus {
    border-color: var(--col-dark);
  }

  .buttons {
    margin-top: 16px;
    display: flex;
    gap: 16px;
    justify-content: center;
  }
</style>