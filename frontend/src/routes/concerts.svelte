<script>
    import DisplayEvents from "$lib/DisplayEvents.svelte";
    let title;
    let artistName;
    let organizer;
    let category;
    let date;
    let query;

    $:if(title||artistName||organizer||category||date){
        createQuery();
    }

    const createQuery=()=>{
        const queryParamsArray=[]
        if(title&&title!=""){
            queryParamsArray.push(`title=${title}`)
        }
        if(artistName&&artistName!=""){
            queryParamsArray.push(`artistName=${artistName}`)
        }
        if(organizer&&organizer!=""){
            queryParamsArray.push(`organizer=${organizer}`)
        }
        if(category&&category!=""){
            queryParamsArray.push(`category=${category}`)
        }
        if(date&&date!=""){
            queryParamsArray.push(`date=${date}`)
        }
        let subQuery=""
        for(let i=0;i<queryParamsArray.length;i++){
            // console.log({queryParamOfArray:queryParamsArray[i],i})
            if(i==queryParamsArray.length-1){
                //last element
                subQuery=subQuery+queryParamsArray[i]
            }else{
                //not last element
                subQuery=subQuery+queryParamsArray[i]+"&"
            }
        }
        query=subQuery;
        // console.log({queryParamsArray,query})
    }

</script>

<h1>Search Filters</h1>
<form on:submit|preventDefault={createQuery}>
    <input type="text" name="title" placeholder="title" bind:value={title}/>
    <input type="text" name="date" placeholder="date" bind:value={date}/>
    <input type="text" name="artistName" placeholder="artistName" bind:value={artistName}/>
    <input type="text" name="category" placeholder="category" bind:value={category}/>
    <input type="text" name="organizer" placeholder="organizer" bind:value={organizer}/>
    <button >Submit</button>
</form>

<DisplayEvents concertsPage={true} query={query}></DisplayEvents>