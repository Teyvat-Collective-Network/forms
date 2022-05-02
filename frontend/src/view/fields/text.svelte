<script>
  export let field;
  export let showRequired;
  let charCount = field.value?.length || 0;

  function resize(e) {
    charCount = e.target.value.length;
    if (!charCount) showRequired = true;
    e.target.style.height = '0px';
    e.target.style.height = (e.target.scrollHeight + 2) + 'px';
  }
</script>


<div class="field" class:missing={showRequired && field.required && (!field.value || field.value.length > field.options?.max)}>
  <h4>{field.name}</h4>
  <p>{field.description}</p>
  <div class="input">
    {#if field.options?.max}
      <div class="counter" style={charCount>field.options.max?'color:red':''}>{charCount}/{field.options.max}</div>
    {/if}
    <textarea on:input={resize} bind:value={field.value}></textarea>
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

  .missing {
    border: 1px solid red;
    padding: 15px;
  }

  .input {
    position: relative;
  }

  .counter {
    position: absolute;
    right: 0px;
    top: -24px
  }

  textarea {
    background-color: var(--bg-contrast);
    color: var(--txt-main);
    height: 41px;
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
  textarea:focus {
    border-color: var(--col-dark);
  }
</style>