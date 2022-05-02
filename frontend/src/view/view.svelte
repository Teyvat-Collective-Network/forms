<script>
  import { path, token } from '../stores.js';

  import Stage from './stage.svelte';
  import Error from '../components/error.svelte';

  export let parts;

  let stage = 0;
  let showRequired = false;

  function next() {
    if (form.stages[stage].fields.some(f => f.required && !(f.value?.length ?? (f.value || f.value === 0)) || f.options?.max && f.value?.length > f.options.max)) return showRequired = true;
    if (stage < form.stages.length-1) {
      showRequired = false;
      return stage++;
    }
    
    const fields = form.stages.reduce((a,v) => a.concat(v.fields), []);
    console.log(fields);
    fetch(`api/forms/${parts[0]}/responses`, {
      method: 'POST',
      body: JSON.stringify(fields),
      headers: {
        'Content-Type': 'application/json',
        Authorization: $token,
      },
    }).then(() => $path = '/submitted');
  }
  
  function prev() {
    if (stage <= 0) return $path = '/list';
    showRequired = false;
    stage--;
  }

  function jump(idx) {
    return () => {
      if (form.stages.slice(stage, idx).some(s => s.fields.some(f => f.required && !(f.value?.length ?? (f.value || f.value === 0)) || f.options?.max && f.value?.length > f.options.max))) return showRequired = true;
      showRequired = false;
      stage = idx;
    }
  }

  let form;

  token 
    ? fetch(`/api/forms/${parts[0]}`, {
      headers: { 'Authorization': $token },
    }).then(async res => form = await res.json())
    : form = {
      statusCode: 401,
      error: 'Unauthorized',
      message: 'You are not logged in',
    }
</script>


{#if form?.error}
<Error error={form}/>

{:else if form}
<div class="form">
  <h1>{form.name}</h1>
  <Stage stage={form.stages[stage]} {showRequired}/>

  <div class="buttons">
    {#if form.stages.length > 1}
      <span on:click={prev} style="padding: 0px {stage === 0 ? '0' : '8'}px;" class="arrow fa-solid fa-{stage === 0 ? 'angles' : 'angle'}-left"></span>
      {#each form.stages as _, i}
        <span on:click={jump(i)} class="circle" class:active={i === stage}></span>
      {/each}
      {#if stage === form.stages.length-1}  
        <span on:click={next} style="font-size: 24px;" class="arrow fa-solid fa-circle-check"></span>
      {:else}
        <span on:click={next} style="padding: 0px 4px;" class="arrow fa-solid fa-angle-right"></span>
      {/if}

    {:else}
      <div on:click={prev} class="button">
        <span on:click={prev} class="fa-solid fa-angles-left"></span>
        Cancel
      </div>
      <div on:click={next} class="button">
        <span on:click={next} class="fa-solid fa-circle-check"></span>
        Submit
      </div>
    {/if}
  </div>
</div>
{/if}


<style>
  .form {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  h1 {
    background-color: var(--bg-contrast);
    border-radius: 8px;
    padding: 16px;
  }

  .buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }

  .arrow {
    display: inline-block;
    width: 32px;
    box-sizing: border-box;
    font-size: 32px;
    color: var(--col-dark);
    transition: .15s;
    cursor: pointer;
  }
  .arrow:hover {
    color: var(--col-mid);
  }

  .circle {
    width: 24px;
    height: 24px;
    background-color: var(--col-mid);
    cursor: pointer;
    border-radius: 50%;
    transition: .15s;
  }
  .circle:hover,
  .circle.active {
    background-color: var(--col-dark);
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

  .button span {
    font-size: 16px;
  }

  :global(.form .sortable-ghost) {
    opacity: 0;
  }

  :global(.form .sortable-chosen) {
    background-color: var(--col-dark);
    color: #fff;
  }
</style>