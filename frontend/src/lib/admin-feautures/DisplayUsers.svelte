<script>
    import UserElement from "./UserElement.svelte"
    export let users;
</script>

{#if users}
    {#each users as user}
        <UserElement user={user}/>
    {/each}
{/if}