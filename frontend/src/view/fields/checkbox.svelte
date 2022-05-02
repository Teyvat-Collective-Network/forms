<script>
  export let field;
  export let showRequired;

  function check() {
    showRequired = true;
    field.value = !field.value;
  }
</script>


<div class="field" class:missing={showRequired && field.required && !field.value}>
  <h4>{field.name}</h4>
  <p on:click={check} class:checked={field.value}>
    <span class="indicator fa-solid fa-check"></span>
    {field.description}
  </p>
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

  .missing {
    border: 1px solid red;
    padding: 15px;
  }

  p {
    cursor: pointer;
  }

  .indicator {
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
  p:hover .indicator {
    border-color: var(--col-dark);
  }

  p.checked .indicator {
    border-color: var(--col-dark);
    background-color: var(--col-dark);
    color: #fff;
  }
</style>