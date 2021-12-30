<script>
    import {viewEvent,user,access_token,refresh_token} from '../stores/store';
    import {onMount} from "svelte"
    let action;

    //add/remove to/from favorites/subscriprions
    // ###add concert to favorites
    // PUT http://34.118.86.60:5000/api/user/concert-to-favorites/id12345
    // access_token: cf28aa5205586f29bd12cb2f9cc20780f4f856a2
    // refresh_token: nanananana

    // ###delete concert from favorites
    // DELETE http://34.118.86.60:5000/api/user/concert-from-favorites/id1234
    // access_token: cf28aa5205586f29bd12cb2f9cc20780f4f856a2
    // refresh_token: nanananana
    const modifyFavOrSubs=async(data)=>{
        try {
            const {type,action}=data
            let toOrFrom
            action=="DELETE"? toOrFrom="from" :toOrFrom="to";
            const response=await fetch(`http://34.118.86.60:5000/api/user/concert-${toOrFrom}-${type}/${$viewEvent._id}`,{
                    method:action,
                    headers:{"Content-Type":"application/json","access_token":$access_token,"refresh_token":$refresh_token},
                })
                console.log(response)
                if(response.status>=300){
                    const parseRes=await response.json()
                    throw parseRes
                }
                const parseRes=await response.json()
                console.log(parseRes)
                user.set(parseRes.user)
        } catch (error) {
            console.error(error)
        }
    }


    $:if(action){
        console.log(action)
        modifyFavOrSubs(action)
    }

    let toFavorites=false;
    let toSubscriptions=false;
    onMount(()=>{
        for (const el of $user.favorites){
            if(el._id==$viewEvent._id){
                toFavorites=true;
                break;
            }
        }
        for (const el of $user.concertSubscriptions){
            if(el._id==$viewEvent._id){
                toSubscriptions=true;
                break;
            }
        }
        const favorites=$user.favorites
    })
</script>

<!-- {JSON.stringify({toFavorites,toSubscriptions})} -->
<h1>Check the event:{$viewEvent.title}</h1>
<p>title:{$viewEvent.title}</p>
<p>date:{$viewEvent.date}</p>
<p>artistName:{$viewEvent.artistName}</p>
<p>category:{$viewEvent.category}</p>
{#if $viewEvent.img}
    <p>img:{$viewEvent.img}</p>
{/if}
<p>Availability:</p>
<p>tickets for sale at:{$viewEvent.startTickets}</p>
<p>tickets available till:{$viewEvent.stopTickets}</p>
{#if $viewEvent.soldOut==true}
    <p>❌Tickets are Sold Out</p>
{:else}
    <p>☑We have available tickets</p>
{/if}


<li>
    {#if !toFavorites}
    <input type=radio bind:group={action} value={{type:"favorites",action:"PUT"}}>
    Add to Favorites
    {:else}
    <input type=radio bind:group={action} value={{type:"favorites",action:"DELETE"}}>
    ❌ Remove from Favorites   
    {/if}
    {#if !toSubscriptions}
    <input type=radio bind:group={action} value={{type:"subscriptions",action:"PUT"}}>
    Add to Subscriptions
    {:else}   
    <input type=radio bind:group={action} value={{type:"subscriptions",action:"DELETE"}}>
    ❌ Remove from Subscriptions 
    {/if}
</li>

