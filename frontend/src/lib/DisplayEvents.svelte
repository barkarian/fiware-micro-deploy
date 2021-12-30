<script>
    import {access_token,refresh_token, user,roleEventOrganizer} from '../stores/store.js';
    import EventElementOrganizer from "../lib/manage-events/EventElementOrganizer.svelte"
    import EventElementUser from "./user/EventElementUser.svelte"
    export let query=null;
    export let manageEvents=null;

    let events=null;
    import { onMount } from 'svelte';


    // ###query1
    // GET http://34.118.86.60:5000/api/user/concerts?title=scor&category=rock
    // access_token: cf28aa5205586f29bd12cb2f9cc20780f4f856a2
    // refresh_token: nanananana
    const getEvents= async ()=>{
        try {
            console.log({queryUrl_Is:`http://34.118.86.60:5000/api/user/concerts${query? "?"+query  :  ""}`})
            const response=await fetch(`http://34.118.86.60:5000/api/user/concerts${query? "?"+query  :  ""}`,{
				method:"GET",
				headers:{"Content-Type":"application/json","access_token":$access_token,"refresh_token":$refresh_token},
			})
			if(response.status>=300){
                const parseRes=await response.json()
                throw parseRes
            }
            console.log({response})
            const parseRes=await response.json()
            console.log({parseRes})
            events=parseRes
        } catch (error) {
            console.error(error)
        }

    }

    $:if(manageEvents){
        events=$user.concerts
    }

    $:if(query){
        getEvents()
    }
    onMount(async () => {
        if(manageEvents){
            events=$user.concerts
        }else{
            await getEvents()
        }
	});
</script>

<h1>Display events</h1>
{#if events &&events.length>0}
    {#if manageEvents}
        {#each events as event}
            <EventElementOrganizer event={event}></EventElementOrganizer>
        {/each}
    {:else}
        {#each events as event}
            <EventElementUser event={event}></EventElementUser>
        {/each}
    {/if}
{/if}