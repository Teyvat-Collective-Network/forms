<script>
  import Sortable from 'sortablejs';

  export let remove;
  export let showRequired;
  export let field;
  field.options ||= [];

  let options;
  $: options && Sortable.create(options, {
    onEnd: evt => {
      field.options.splice(evt.newIndex, 0, ...field.options.splice(evt.oldIndex, 1));
    },
    animation: 150,
    handle: '.option-handle',
  })

  function editOption(idx) {
    return e => field.options[idx] = e.target.value;
  }

  function addOption() {
    field.options.push('');
    field = field;
  }

  function removeOption(idx) {
    return () => {
      field.options.splice(idx, 1);
      field = field;
    }
  }

  function resize(e) {
    e.target.style.height = '0px';
    e.target.style.height = (e.target.scrollHeight + 2) + 'px';
  }
</script>


<div class="field">
  <div class="header">
    <span class="field-handle fa-solid fa-bars"></span>
    <span class="type">{field.type}</span>
    <input type="text" placeholder="field name" class:missing={showRequired && !field.name} bind:value={field.name}>
    <span class="cross fa-solid fa-xmark" on:click={remove}></span>
  </div>

  <textarea placeholder="field description" on:input={resize} bind:value={field.description}></textarea>

  <div class="options" bind:this={options}>
    {#each field.options as option, i}
      <div class="option">
        <span class="option-handle fa-solid fa-bars"></span>
        <input type="text" placeholder="value" class:missing={showRequired && !option} on:input={editOption(i)} value={option}>
        <span class="cross fa-solid fa-xmark" on:click={removeOption(i)}></span>
      </div>
    {/each}
  </div>

  <div class="add" class:missing={showRequired && !field.options.length} on:click={addOption}>
    <span class="plus fa-solid fa-plus"></span>
    <span>Add Option</span>
  </div>
</div>


<style>
  .field {
    padding: 16px;
    border-radius: 4px;
    border: 1px solid var(--col-mid);
  }

  .header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .field-handle,
  .option-handle {
    padding: 4px;
    cursor: grab;
  }

  .type {
    background-color: var(--col-dark);
    color: #fff;
    border-radius: 4px;
    padding: 10px;
  }

  .cross {
    padding: 4px;
    cursor: pointer;
  }

  :is(.field-handle, .option-handle, .cross) {
    display: inline-block;
    box-sizing: border-box;
    font-size: 24px;
    color: var(--col-mid);
    transition: .15s;
  }
  :is(.field-handle, .option-handle, .cross):hover {
    color: var(--txt-main);
  }

  textarea {
    margin-bottom: 16px;
  }

  .options {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .option {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .add {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px;
    margin-top: 8px;
    border: 1px solid var(--col-mid);
    border-radius: 4px;
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

  .missing {
    border-color: red;
  }
</style>