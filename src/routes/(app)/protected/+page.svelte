<!-- <script lang="ts">
  import { page } from "$app/stores"
</script>

{#if $page.data.session}
<h1>Protected page</h1>
<p>
  This is a protected content. You can access this content because you are
  signed in.
</p>
<p>Session expiry: {$page.data.session?.expires}</p>
{:else}
<h1>Access Denied</h1>
<p>
  <a href="/auth/signin">
    You must be signed in to view this page
  </a>
</p>
{/if}
-->

<script>
 import { signIn, signOut } from '@auth/sveltekit/client';
 import { page } from '$app/stores';
</script>

<p>
 {#if Object.keys($page.data.session || {}).length}

    {#if $page.data.session?.user?.image}
      <img
        src={$page.data.session?.user?.image}
        alt={$page.data.session?.user?.name}
        style="width: 64px; height: 64px;" />
      <br/>
  {/if}
  <span>
   <strong>{$page.data.session?.user?.email || $page.data.session?.user?.name}</strong>
  </span>
    <br/>
    <span>Session expires: {new Date($page.data.session?.expires ?? 0).toUTCString()}</span>
    <br/>
  <button on:click={() => signOut()} class="button">Sign out</button>

  {:else}
  <span>You are not signed in words</span><br/>
  <button on:click={() => signIn('github')}>Sign In with GitHub</button>
 {/if}
</p>
