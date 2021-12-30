<script>
    import {access_token, user,refresh_token} from '../stores/store.js';
    import DisplayUsers from "$lib/admin-feautures/DisplayUsers.svelte"
    import { onMount } from 'svelte';
    let users=null;
    const getAllUser=async ()=>{
        // ###get users
        // GET http://34.118.86.60:5000/api/admin/all-users
        // Content-Type: application/json
        // access_token: 17b3f9a2de6b54cc330fc40ef8f2ffda4157b91d
        // refresh_token:nanananannaananan
        const response=await fetch("http://34.118.86.60:5000/api/admin/all-users",{
                method:"GET",
                headers:{"Content-Type":"application/json","access_token":$access_token,"refresh_token":$refresh_token},
            })
            if(response.status>=300){
                const parseRes=await response.json()
                throw parseRes
            }
            const parseRes=await response.json()
            users=parseRes
    }

    onMount(async () => {
            await getAllUser()
		});
</script>

<DisplayUsers users={users}/>