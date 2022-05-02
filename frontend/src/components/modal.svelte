<script>
  export let id;
  export let onClose;
  let root;

  function close() {
    root.classList.remove('open');
    onClose?.();
  }
</script>


<div bind:this={root} {id} on:click={close} class="container">
  <div class="modal" on:click={e => e.stopPropagation()}>
    <span class="close fa-solid fa-xmark" on:click={close}></span>
    <slot></slot>
  </div>
</div>


<style>
  .container {
    visibility: visible;
    padding: 64px;
    box-sizing: border-box;
    position: fixed;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    background-color: #000000da;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: .15s, visibility 0s 0s;
    z-index: 10;
  }

  .container:not(.open) {
    opacity: 0;
    visibility: hidden;
    transition: .15s, visibility 0s .15s;
  }

  .modal {
    position: relative;
    max-width: 768px;
    background-color: var(--bg-main);
    padding: 16px;
    border-radius: 8px;
    transition: .15s;
  }

  .container:not(.open) .modal {
    transform: scale(.75);
  }

  .close {
    color: var(--col-mid);
    position: absolute;
    top: 4px;
    right: 4px;
    cursor: pointer;
    transition: .15s;
  }
  .close:hover {
    color: var(--txt-main);
  }

  @media screen and (max-width: 540px) {
    .container {
      padding: 32px;
    }
  }
</style>