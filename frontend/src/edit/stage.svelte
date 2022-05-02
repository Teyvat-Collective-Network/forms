<script>
  import Sortable from 'sortablejs';

  import None from './fields/none.svelte';
  import Text from './fields/text.svelte';
  import Select from './fields/select.svelte';
  import Order from './fields/order.svelte';
  import Checkbox from './fields/checkbox.svelte';

  const types = {
    none: None,
    text: Text,
    select: Select,
    order: Order,
    checkbox: Checkbox,
  };

  let fields;
  $: fields && Sortable.create(fields, {
    onEnd: evt => {
      stage.fields.splice(evt.newIndex, 0, ...stage.fields.splice(evt.oldIndex, 1));
    },
    animation: 150,
    handle: '.field-handle',
  });

  export let stage;
  export let remove;
  export let showRequired;

  let open = false;
  let height = 57;
  let root;
  $: height = root?.scrollHeight;

  function stageHeight() {
    setTimeout(() => height = root.scrollHeight, 0);
  }

  function removeField(idx) {
    return () => {
      stage.fields.splice(idx, 1);
      stage = stage;
    };
  }

  function addField(type) {
    return () => {
      stage.fields.push({
        name: '',
        description: '',
        type,
      });
      stage = stage;
    }
  }

  function validate() {
    if (!stage.name || !stage.fields.length) return false;
    return stage.fields.every(field => 
      field.name &&
      (['text', 'none', 'checkbox'].includes(field.type) || field.options?.length && field.options.every(o=>o))
    );
  }
</script>


<div class="stage" on:input={stageHeight} on:click={stageHeight} class:open={open} class:missing={showRequired && !open && !validate()} bind:this={root} style="max-height:{open?height+'px':'57px'};">
  <div class="header">
    <span class="arrow fa-solid fa-angle-right" on:click={() => open = !open}></span>
    <span class="stage-handle fa-solid fa-bars"></span>
    <input type="text" class:missing={showRequired && !stage.name} bind:value={stage.name}>
    <span class="cross fa-solid fa-xmark" on:click={remove}></span>
  </div>

  <div class="fields" bind:this={fields}>
    {#each stage.fields as field, i}
      <svelte:component this={types[field.type]} remove={removeField(i)} {field} {showRequired}/>
    {/each}
  </div>

  <div class="adds">
    {#each Object.keys(types) as type}
      <div class="add" class:missing={showRequired && !stage.fields.length} on:click={addField(type)}>
        <span class="plus fa-solid fa-plus"></span>
        <span>Add {type} field</span>
      </div>
    {/each}
  </div>
</div>


<style>
  .stage {
    background-color: var(--bg-contrast);
    padding: 8px 16px;
    border-radius: 8px;
    box-sizing: border-box;
    overflow: hidden;
    transition: .15s;
  }
  .stage.missing {
    padding: 7px 15px;
    border: 1px solid red;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .arrow {
    cursor: pointer;
    padding: 4px;
  }
  .open .arrow {
    transform: rotate(90deg);
  }

  .stage-handle {
    padding: 4px 0px;
    cursor: grab;
  }

  .cross {
    cursor: pointer;
  }

  :is(.arrow, .stage-handle, .cross) {
    display: inline-block;
    box-sizing: border-box;
    font-size: 24px;
    color: var(--col-mid);
    transition: .15s;
  }
  :is(.arrow, .stage-handle, .cross):hover {
    color: var(--txt-main);
  }

  .fields {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin: 24px 0px;
  }

  .adds {
    display: flex;
    gap: 8px;
  }

  .add {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
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