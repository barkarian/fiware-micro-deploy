<script>
    import {viewEvent,access_token,refresh_token,user} from '../stores/store';
    import { onMount } from 'svelte';
    let event={};
    let soldOutAction;
    let message;
    // ###modify one event
    // PUT http://34.118.86.60:5000/api/events/61c0ca48046ffefb6c735550
    // Content-Type: application/json
    // access_token: ea11cad6b2fd0d7056048fc303a387d465b27594
    // refresh_token: nanananana

    // {
    //     "title": "titlexxx",
    //     "date": "datexxx",
    //     "soldOut":false,
    //     "startTickets":"14/08/2022",
    //     "stopTickets":"12/08/2022"
    // }
    const modifyEvent=async()=>{
        try {
            const response=await fetch(`http://34.118.86.60:5000/api/events/${event._id}`,{
                method:"PUT",
                headers:{"Content-Type":"application/json","access_token":$access_token,"refresh_token":$refresh_token},
                body:JSON.stringify(event)
            })
            console.log(response)
            if(response.status>=300){
                const parseRes=await response.json()
                throw parseRes
            }
            const parseRes=await response.json()
            user.set(parseRes.user);
            message="The event has been successfully modified"
            console.log(parseRes)
        } catch (error) {
            console.error(error)
        }
    }

    // ###delete one event
    // DELETE http://34.118.86.60:5000/api/events/61c0bf741caed9a6818fffd3
    // Content-Type: application/json
    // access_token: ea11cad6b2fd0d7056048fc303a387d465b27594
    // refresh_token: nanananana
    const removeEvent=async()=>{
        try {
            const response=await fetch(`http://34.118.86.60:5000/api/events/${event._id}`,{
                method:"DELETE",
                headers:{"Content-Type":"application/json","access_token":$access_token,"refresh_token":$refresh_token},
            })
            console.log(response)
            if(response.status>=300){
                const parseRes=await response.json()
                throw parseRes
            }
            const parseRes=await response.json()
            message="The event has been successfully deleted"
            event=null
            console.log(parseRes)
        } catch (error) {
            console.error(error)
        }
    }

    const changeSoldOut=(newValue)=>{
        event.soldOut=newValue
    }
    $:if(soldOutAction||soldOutAction==false){
        changeSoldOut(soldOutAction)
    }

    onMount(() => {
        event=$viewEvent

		});
</script>
<h1>Modify event:{$viewEvent.title}</h1>

{#if message}
    <p>{message}</p>
{/if}
{#if event}
    <form on:submit|preventDefault={modifyEvent}>
        <p>title:<input type="text" name="title" placeholder="title" bind:value={event.title}/></p>
        <p>date:<input type="text" name="date" placeholder="date" bind:value={event.date}/></p>
        <p>artistName:<input type="text" name="artistName" placeholder="artistName" bind:value={event.artistName}/></p>
        <p>startTickets:<input type="text" name="startTickets" placeholder="startTickets" bind:value={event.startTickets}/></p>
        <p>stopTickets:<input type="text" name="stopTickets" placeholder="stopTickets" bind:value={event.stopTickets}/></p>
        <p>
            soldOut({event.soldOut}):
            {#if event.soldOut==false}
                <input type=radio bind:group={soldOutAction} value={true}>
                ☑
            {:else}
                <input type=radio bind:group={soldOutAction} value={false}>
                ❌
            {/if}
        </p>
        <p>category:<input type="text" name="category" placeholder="category" bind:value={event.category}/></p>
        <p>img:<input type="text" name="img" placeholder="image(optional)" bind:value={event.img}/></p>
        <button >Submit</button>
    </form>

    <button on:click|once={removeEvent}>  
        Remove this Event ❌
    </button>
{/if}
