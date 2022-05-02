<script>
  export let response;
  $: console.log(response);
</script>


<div class="response">
  {#each response.answers as field}
    <div class="field">
      <h3>{field.name}</h3>
      <p class="description">
        {#if field.type === 'checkbox'}
          <span class="checkbox fa-solid fa-check" class:checked={field.value}></span>
        {/if}
        {field.description}
      </p>
      {#if ['text', 'select'].includes(field.type)}
        <p class="text">{field.value}</p>
      {:else if field.type === 'order'}
        {#each field.value as value}
          <p class="text">{value}</p>
        {/each}
      {/if}
    </div>
  {/each}
</div>


<style>
  .response {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .field {
    background-color: var(--bg-contrast);
    border-radius: 8px;
    padding: 16px;
  }

  .checkbox {
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

  .checkbox.checked {
    border-color: var(--col-dark);
    background-color: var(--col-dark);
    color: #fff;
  }
</style>