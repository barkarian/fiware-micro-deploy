<script>
    let eventData={};
    eventData.soldOut=false
    import {access_token,refresh_token,user as userStore} from '../../stores/store';
    let message=null
    // ###create one event
    // POST http://34.118.86.60:5000/api/events/create
    // Content-Type: application/json
    // access_token: ea11cad6b2fd0d7056048fc303a387d465b27594
    // refresh_token: nanananana

    // {
    //     "title": "title1",
    //     "date": "date1",
    //     "artistName": "artistName1",
    //     "startTickets":"4/08/2022",
    //     "stopTickets":"10/08/2022",
    //     "soldOut":false,
    //     "category": "category1"
    // }
    const createNewEvent= async()=>{
        try {
            const response=await fetch(`http://34.118.86.60:5000/api/events/create`,{
				method:"POST",
				headers:{"Content-Type":"application/json","access_token":$access_token,"refresh_token":$refresh_token},
                body:JSON.stringify(eventData)
			})
			if(response.status>=300){
                const parseRes=await response.json()
                throw parseRes
            }
            console.log({response})
            const parseRes=await response.json()
            userStore.set(parseRes.user);
            console.log({parseRes})
            message=parseRes
        } catch (error) {
            console.error(error)
        }
    }
</script>

<h1>Create Event</h1>
<form on:submit|preventDefault={createNewEvent}>
    <input type="text" name="title" placeholder="title" bind:value={eventData.title}/>
    <input type="text" name="date" placeholder="date" bind:value={eventData.date}/>
    <input type="text" name="artistName" placeholder="artistName" bind:value={eventData.artistName}/>
    <input type="text" name="startTickets" placeholder="startTickets" bind:value={eventData.startTickets}/>
    <input type="text" name="stopTickets" placeholder="stopTickets" bind:value={eventData.stopTickets}/>
    <input type="text" name="category" placeholder="category" bind:value={eventData.category}/>
    <input type="text" name="img" placeholder="image(optional)" bind:value={eventData.img}/>
    <button >Submit</button>
</form>