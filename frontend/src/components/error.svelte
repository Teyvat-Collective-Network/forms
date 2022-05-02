<script>
  import { token, path } from '../stores.js';

  export let error;
</script>


<div class="error">
  <h1>{error.message}</h1>
  {#if error.statusCode == 401}
    <h2><a class="button" href="oauth?redirect={encodeURIComponent(`#${$path}`)}">Log in</a></h2>
  {:else}
    <h2><a class="button" href="#/list">Back to the form list</a></h2>
  {/if}
</div>


<style>
  .error {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    border-radius: 4px;
    background-color: var(--col-dark);
    color: #fff;
    cursor: pointer;
    transition: .15s;
  }
  .button:hover {
    background-color: var(--col-mid);
  }
</style>