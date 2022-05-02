<script>
  import Sortable from 'sortablejs';

  export let field;
  field.value = field.options;

  let options;
  $: options && Sortable.create(options, {
    onEnd: evt => {
      field.options.splice(evt.newIndex, 0, ...field.options.splice(evt.oldIndex, 1));
      field.value.splice(evt.newIndex, 0, ...field.value.splice(evt.oldIndex, 1));
    },
    animation: 150,
    handle: '.handle',
  });
</script>


<div class="field">
  <h4>{field.name}</h4>
  <p class="description">{field.description}</p>
  <div class="options" bind:this={options}>
    {#each field.options as option}
      <div class="option">
        <span class="handle fa-solid fa-bars"></span>
        <span>{option}</span>
      </div>
    {/each}
  </div>
</div>


<style>
  .field {
    background-color: var(--bg-contrast);
    border-radius: 8px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .description {
    white-space: pre-line;
  }

  .options {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 4px 0px;
  }

  .option {
    border: 1px solid var(--col-mid);
    border-radius: 4px;
    padding: 0px 4px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .handle {
    display: inline-block;
    box-sizing: border-box;
    color: var(--col-mid);
    transition: .15s;
    padding: 4px;
    cursor: grab;
  }

  .handle:hover {
    color: var(--txt-main);
  }
</style>