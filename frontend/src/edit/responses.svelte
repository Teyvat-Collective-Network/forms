<script>
  import { token } from '../stores.js';
  
  import Response from './response.svelte';

  export let form;
  
  let responses = [];
  let response;

  form._id && fetch(`/api/forms/${form._id}/responses`, {
    headers: { 'Authorization': $token },
  }).then(async res => responses = await res.json());
</script>


<div class="responses">
  {#if response != null}
    <div class="single">
      <p class="back" on:click={() => response = null}>
        <span class="fa-solid fa-angle-left"></span>
        Back
      </p>
      <Response response={responses[response]}/>
    </div>
  {:else}
    {#if responses.length}
      {#each responses as res, i}
        <div class="response" on:click={() => response = i}>
          <h3>{res.submitter}</h3>
        </div>
      {/each}
    {:else}
      <h2>There are no responses to this form.</h2>
    {/if}
  {/if}
</div>


<style>
  .responses {
    padding-top: 32px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .response {
    background-color: var(--bg-contrast);
    padding: 8px;
    cursor: pointer;
    border-radius: 8px;
    transition: .15s;
  }
  .response:hover {
    background-color: var(--col-light);
  }

  .back {
    width: fit-content;
    background-color: var(--col-dark);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #fff;
    margin-bottom: 16px;
    padding: 12px 24px;
    border-radius: 4px;
    cursor: pointer;
    transition: .15s;
  }
  .back:hover {
    background-color: var(--col-mid);
  }
</style>