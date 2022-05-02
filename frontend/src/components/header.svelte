<script>
  import { path, token } from '../stores.js';

  function logout() {
    $token = undefined;
    window.localStorage.removeItem('token');
  }
</script>


<header>
  <div class="brand">
    <h1 on:click={() => $path = '/list'}>TCN Forms</h1>
  </div>

  {#if !$token}
    <a class="button" href="oauth?redirect={encodeURIComponent(`#${$path}`)}">Log in</a>
  {:else}
    <a class="button" on:click={logout} href="/">Log out</a>
  {/if}
</header>


<style>
  header {
    background-color: var(--bg-contrast);
    padding: 16px calc((100% - min(1152px, 100% - 128px)) / 2);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .brand {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 32px;
  }

  .brand h1 {
    cursor: pointer;
  }

  .button {
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