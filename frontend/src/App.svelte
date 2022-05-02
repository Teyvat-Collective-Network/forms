<script>
	import { path } from './stores.js';

  import Header from './components/header.svelte';
  import Footer from './components/footer.svelte';

  import Forms from './list/forms.svelte';
  import Edit from './edit/edit.svelte';
  import View from './view/view.svelte';
  import Submitted from './view/submitted.svelte';

  const pages = {
    list: Forms,
    edit: Edit,
    form: View,
    submitted: Submitted,
  };

  window.onpopstate = function () {
    $path = window.location.hash.slice(1);
  }

  $: window.location.hash = $path;
  $: [,page, ...parts] = $path.split('/');

  $: console.log(page);
</script>


<Header/>

<main>
  <svelte:component this={pages[page]} {parts}/>
  <Footer/>
</main>


<style>
  main {
    max-width: 1280px;
    margin: 32px auto;
    padding: 0px 64px;
    box-sizing: border-box;
  }
</style>