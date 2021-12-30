<script>
    import {access_token,refresh_token,user,viewEvent} from "../stores/store"
    import {onMount} from "svelte"
    import {goto} from "$app/navigation"
    let events;
    let action;
    $:if(action){
        if(action._id){
            checkEvent(action)
        }else{
            modifyFavOrSubs(action)
        }
    }
    const checkEvent=async(event)=>{
        console.log(event)
        viewEvent.set(event)
        goto("/event")
     }
     const modifyFavOrSubs=async(data)=>{
        try {
            const {type,action,eventId}=data
            let toOrFrom
            action=="DELETE"? toOrFrom="from" :toOrFrom="to";
            const response=await fetch(`http://34.118.86.60:5000/api/user/concert-${toOrFrom}-${type}/${eventId}`,{
                    method:action,
                    headers:{"Content-Type":"application/json","access_token":$access_token,"refresh_token":$refresh_token},
                })
                console.log(response)
                if(response.status>=300){
                    const parseRes=await response.json()
                    throw parseRes
                }
                const parseRes=await response.json()
                user.set(parseRes.user)
                events=events.filter(e=>e._id!=eventId)
                console.log(parseRes)
                user.set(parseRes.user)
        } catch (error) {
            console.error(error)
        }
    }
    // ###find by ids
    // POST http://34.118.86.60:5000/api/user/concerts-by-ids
    // Content-Type: application/json
    // access_token: 5d5b1426e070d649de50d6d0ffedc76721d5bac8
    // refresh_token: nanananana

    // [
    //     {"_id":"61c9e4abb92fdf67ba37f73a"}
    // ]
    const getSubscriptions=async()=>{
        try {
            const response=await fetch("http://34.118.86.60:5000/api/user/concerts-by-ids",{
                    method:"POST",
                    headers:{"Content-Type":"application/json","access_token":$access_token,"refresh_token":$refresh_token},
                    body:JSON.stringify($user.concertSubscriptions)
                })
                if(response.status>=300){
                    const parseRes=await response.json()
                    throw parseRes
                }
                const parseRes=await response.json()
                console.log({parseRes})
                return parseRes.events;
        } catch (error) {
            console.error(error)
        }
    }
    onMount(async ()=>{
        events=await getSubscriptions()
        console.log({events})
    })
</script>

{#if events && events.length>0}
    <ul>
        {#each events as element(element._id)}
            <li>{element.title} at {element.date}!The great {element.artistName} gonna be there!!!🤟 
                <input type=radio bind:group={action} value={{type:"subscriptions",action:"DELETE",eventId:element._id}}>
                ❌ Remove from Subscriptions
                <input type=radio bind:group={action} value={element}>
                Check more
            </li> 
        {/each}
    </ul>
{/if}
