<script>
  export let field;
  export let showRequired;
  $: console.log(showRequired);

  function select(idx) {
    return () => {
      showRequired = true;
      field.value = field.value === idx ? null : idx;
    };
  }
</script>


<div class="field" class:missing={showRequired && field.required && field.value == null}>
  <h4>{field.name}</h4>
  <p class="description">{field.description}</p>
  <div class="options">
    {#each field.options as option, i}
      <div class="option" class:selected={field.value === i} on:click={select(i)}><span class="indicator"></span>{option}</div>
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
  .missing {
    border: 1px solid red;
    padding: 15px;
  }

  .options {
    padding: 4px 0px;
  }

  .option {
    border-bottom: none;
    padding: 3px 7px;
    border: 1px solid transparent;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }
  .option:hover {
    border-color: var(--col-mid);
  }

  .indicator {
    background-color: var(--col-mid);
    display: inline-block;
    width: 8px;
    height: 8px;
    border: 4px solid var(--col-mid);
    border-radius: 50%;
    transition: .15s;
  }
  .option:hover .indicator {
    border-color: var(--col-dark);
  }

  .selected .indicator {
    background-color: #fff;
    border-color: var(--col-dark);
  }
</style>