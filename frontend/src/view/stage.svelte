<script>
  import Select from './fields/select.svelte';
  import None from './fields/none.svelte';
  import Order from './fields/order.svelte';
  import Text from './fields/text.svelte';
  import Checkbox from './fields/checkbox.svelte';

  export let stage;
  export let showRequired;

  const fields = {
    select: Select,
    none: None,
    order: Order,
    text: Text,
    checkbox: Checkbox,
  };
</script>


<div class="stage">
  {#each stage.fields as field}
    <svelte:component this={fields[field.type]} {field} {showRequired}/>
  {/each}
</div>


<style>
  .stage {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
</style>