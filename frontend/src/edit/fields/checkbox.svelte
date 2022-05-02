<script>
  export let field;
  export let remove;
  export let showRequired;

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

  <p class="checkbox" class:checked={field.required} on:click={() => field.required = !field.required}>
    <span class="fa-solid fa-check"></span>
    required
  </p>
  <textarea placeholder="field description" on:input={resize} bind:value={field.description}></textarea>
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

  .missing {
    border-color: red;
  }

  .field-handle {
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

  :is(.field-handle, .cross) {
    display: inline-block;
    box-sizing: border-box;
    font-size: 24px;
    color: var(--col-mid);
    transition: .15s;
  }
  :is(.field-handle, .cross):hover {
    color: var(--txt-main);
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
</style>