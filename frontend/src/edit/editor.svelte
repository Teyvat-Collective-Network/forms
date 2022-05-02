<script>
  import Sortable from 'sortablejs';
  import Stage from './stage.svelte';

  export let form;
  export let showRequired;

  const perms = {
    MODERATOR:  1<<0,
    EVENT:      1<<1,
    THEORY:     1<<2,
    LEAKS:      1<<3,
    ART:        1<<4,
    DEV:        1<<5,
    OWNER:      1<<6,
    ADVISOR:    1<<7,
    VOTER:      1<<8,
  }

  const permNames = {
    MODERATOR:  'Moderators',
    EVENT:      'Event Staff',
    THEORY:     'Theorycrafting Staff',
    LEAKS:      'Leak Staff',
    ART:        'Art Staff',
    DEV:        'Developer Staff',
    OWNER:      'Server Owners',
    ADVISOR:    'TCN Advisors',
    VOTER:      'TCN Voters',
  }

  $: console.log(form.access.view.users);

  let stages;
  $: stages && Sortable.create(stages, {
    onEnd: evt => {
      form.stages.splice(evt.newIndex, 0, ...form.stages.splice(evt.oldIndex, 1));
    },
    animation: 150,
    handle: '.stage-handle',
  });

  function resize(e) {
    e.target.style.height = '0px';
    e.target.style.height = (e.target.scrollHeight + 2) + 'px';
  }

  function removeStage(idx) {
    return () => {
      form.stages.splice(idx, 1);
      form = form;
    };
  }

  function addStage() {
    form.stages.push({
      name: '',
      fields: [],
    });
    form = form;
  }
</script>


<div class="editor">
  <div class="header">
    <input class="name" class:missing={showRequired && !form.name} type="text" bind:value={form.name}>
    <textarea on:input={resize} bind:value={form.description}></textarea>

    <div class="access">
      <div class="view">
        <h3>Can Submit</h3>
        <p class="checkbox" class:checked={form.access.view.everyone} on:click={() => form.access.view.everyone = !form.access.view.everyone}>
          <span class="fa-solid fa-check"></span>
          Everyone
        </p>
        <br>
        {#if !form.access.view.everyone}
          {#each Object.keys(perms) as key}
            <p class="checkbox" class:checked={(form.access.view.perms || 0) & perms[key]} on:click={() => form.access.view.perms = (form.access.view.perms || 0) ^ perms[key]}>
              <span class="fa-solid fa-check"></span>
              {permNames[key]}
            </p>
          {/each}
          <div class="users">
            {#each form.access.view.users as _user, i}
              <div class="user">
                <input class="user" type="text" bind:value={form.access.view.users[i]}>
                <span class="cross fa-solid fa-xmark" on:click={() => { form.access.view.users.splice(i, 1); form.access.view.users = form.access.view.users }}></span>
              </div>
            {/each}
          </div>
          <div class="button" on:click={() => form.access.view.users.length++}>Add User</div>
        {/if}
      </div>
      
      <div class="edit">
        <h3>Can Edit</h3>
        {#each Object.keys(perms) as key}
          <p class="checkbox" class:checked={(form.access.edit.perms || 0) & perms[key]} on:click={() => form.access.edit.perms = (form.access.edit.perms || 0) ^ perms[key]}>
            <span class="fa-solid fa-check"></span>
            {permNames[key]}
          </p>
        {/each}
        <div class="users">
          {#each form.access.edit.users as _user, i}
            <div class="user">
              <input class="user" type="text" bind:value={form.access.edit.users[i]}>
              <span class="cross fa-solid fa-xmark" on:click={() => { form.access.edit.users.splice(i, 1); form.access.edit.users = form.access.edit.users }}></span>
            </div>
          {/each}
        </div>
        <div class="button" on:click={() => form.access.edit.users.length++}>Add User</div>
      </div>
    </div>
  </div>

  <div class="stages" bind:this={stages}>
    {#each form.stages as stage, i}
      <Stage {stage} remove={removeStage(i)} {showRequired}/>
    {/each}
  </div>

  <div class="add" class:missing={showRequired && !form.stages.length} on:click={addStage}>
    <span class="plus fa-solid fa-plus"></span>
    <span>Add Stage</span>
  </div>
</div>


<style>
  .editor {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .header {
    background-color: var(--bg-contrast);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-radius: 8px;
  }

  .header .name {
    font-size: 24px;
  }

  .access {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .access .users {
    margin: 4px 0px;
  }

  .access .user {
    margin: 2px 0px;
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .checkbox {
    cursor: pointer;
  }

  .checkbox span {
    position: relative;
    bottom: 2px;
    width: 16px;
    height: 16px;
    font-size: 14px;
    background-color: var(--col-mid);
    display: inline-block;
    box-sizing: border-box;
    border: 2px solid var(--col-mid);
    vertical-align: -3px;
    color: var(--col-mid);
    border-radius: 3px;
    transition: .15s;
  }
  .checkbox:hover span {
    border-color: var(--col-dark);
  }

  .checkbox.checked span {
    border-color: var(--col-dark);
    background-color: var(--col-dark);
    color: #fff;
  }

  .button {
    width: fit-content;
    padding: 12px 24px;
    border-radius: 4px;
    background-color: var(--col-dark);
    color: #fff;
    cursor: pointer;
    transition: .15s;
    justify-self: start;
  }
  .button:hover {
    background-color: var(--col-mid);
  }

  .cross {
    font-size: 24px;
    color: var(--col-mid);
    cursor: pointer;
  }

  .cross:hover {
    color: var(--txt-main);
    transition: .15s;
  }

  .stages {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .add {
    background-color: var(--bg-contrast);
    display: flex;
    align-items: center;
    gap: 8px;
    flex-grow: 1;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
  }

  .add .plus {
    font-size: 24px;
    color: var(--col-mid);
    transition: .15s;
  }

  .add:hover .plus {
    color: var(--txt-main);
  }

  .add.missing {
    border: 1px solid red;
    padding: 7px;
  }

  .missing {
    border-color: red;
  }

  :global(.editor input) {
    background-color: var(--bg-contrast);
    color: var(--txt-main);
    resize: none;
    border: 1px solid var(--col-mid);
    border-radius: 4px;
    padding: 8px;
    width: 100%;
    box-sizing: border-box;
    font-family: sans-serif;
    font-size: 16px;
    outline: none;
  }
  :global(.editor input:focus) {
    border-color: var(--col-dark);
  }

  :global(.editor textarea) {
    background-color: var(--bg-contrast);
    color: var(--txt-main);
    height: 41px;
    resize: none;
    border: 1px solid var(--col-mid);
    border-radius: 4px;
    padding: 8px;
    width: 100%;
    box-sizing: border-box;
    flex-shrink: 0;
    font-family: sans-serif;
    font-size: 16px;
    outline: none;
  }
  :global(.editor textarea:focus) {
    border-color: var(--col-dark);
  }

  :global(.editor .sortable-ghost) {
    opacity: 0;
  }

  :global(.editor .sortable-chosen) {
    color: #fff;
  }
</style>