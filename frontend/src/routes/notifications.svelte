<script>
    import {user,unseenNotifications} from "../stores/store"
    import {onDestroy, onMount} from "svelte"
    onDestroy(()=>{
        unseenNotifications.set(null)
    })
</script>

{#if $unseenNotifications}
    <h1>New Unseen Notifications</h1>
    {#each $unseenNotifications as notification }
        <li>{notification.notifData} eventId:{notification.concertId}
            <p>{notification.notifDate}</p>
        </li>
        <!-- <li>{JSON.stringify(notification)}</li> -->
    {/each}
{/if}

<h1>All Notifications</h1>
{#each $user.notifications as notification }
    <li>{notification.notifData} eventId:{notification.concertId}
    {#if notification.notifSeen}
        <p>"seen"</p>
        <p>DATE:{notification.notifDate}</p>
    {:else}
        <p>"new"</p>
        <p>DATE:{notification.notifDate}</p>
    {/if}
    </li>
    <!-- <li>{JSON.stringify(notification)}</li> -->
{/each}