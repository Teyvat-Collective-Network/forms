<script>
  export let field;
  field.value = true;
</script>


<div class="field">
  <h3>{field.name}</h3>
  <p>{field.description}</p>
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

  p {
    white-space: pre-line;
  }
</style>