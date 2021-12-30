<script>
import { goto } from '$app/navigation';

     import {access_token,refresh_token, user,viewEvent} from '../../stores/store';
     export let event=null;

     const checkEvent=async()=>{
          viewEvent.set(event)
          goto("/event")
     }

     const goToModifyEvent=async()=>{
          viewEvent.set(event)
          goto("/modify-event")
     }

</script>

{#if event}
     <h1>{event.title}</h1>
     <p>Category:{event.category}</p>
     <p>Artist name:{event.artistName}</p>
     <p>Date:{event.date}</p>
     <button on:click|once={checkEvent}>  
          Check more infos about the event
     </button>
     <button on:click|once={goToModifyEvent}>  
          Modify your event
     </button>
{/if}