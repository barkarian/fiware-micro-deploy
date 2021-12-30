<script>
    import { onMount } from 'svelte';
    import {access_token,refresh_token,user as userStore} from '../../stores/store';
    export let user;
    let addRoleAction;
    let removeRoleAction;
    let roleAdmin=false;
    let roleUser=false;
    let roleEventOrganizer=false;
    let message=null
    // ###add a role to a user
    // POST http://34.118.86.60:5000/api/admin/add-role
    // Content-Type: application/json
    // access_token: b03b3791f05b0f525f97d3101722f014790d34cb
    // refresh_token:nanananannaananan

    // {
    //     "userId":"61c4def5ae3a59fc73b84d66",
    //     "roleName":"user"
    // }
    const addNewRole=async(roleAndId)=>{
        try {
            const response=await fetch("http://34.118.86.60:5000/api/admin/add-role",{
				method:"POST",
				headers:{"Content-Type":"application/json","access_token":$access_token,"refresh_token":$refresh_token},
				body:JSON.stringify(roleAndId)
			})
			if(response.status>=300){
                const parseRes=await response.json()
                throw parseRes
            }
            const parseRes=await response.json()
            switch (roleAndId.roleName) {
                    case 'user':
                        roleUser=true;
                        break;
                    case 'eventOrganizer':
                        roleEventOrganizer=true;
                        break;
                    case 'admin':
                        roleAdmin=true;
                        break;
                }
            console.log({parseRes})
        } catch (error) {
            console.error(error)
        }
       
    }

    // ###remove a role from a user
    // POST http://34.118.86.60:5000/api/admin/remove-role
    // Content-Type: application/json
    // access_token: b03b3791f05b0f525f97d3101722f014790d34cb
    // refresh_token:nanananannaananan

    // {
    //     "userId":"61c4def5ae3a59fc73b84d66",
    //     "roleName":"user"
    // }

    const removeRole=async(roleAndId)=>{
        try {
            const response=await fetch("http://34.118.86.60:5000/api/admin/remove-role",{
				method:"POST",
				headers:{"Content-Type":"application/json","access_token":$access_token,"refresh_token":$refresh_token},
				body:JSON.stringify(roleAndId)
			})
			if(response.status>=300){
                const parseRes=await response.json()
                throw parseRes
            }
            const parseRes=await response.json()
            switch (roleAndId.roleName) {
                    case 'user':
                        roleUser=false;
                        break;
                    case 'eventOrganizer':
                        roleEventOrganizer=false;
                        break;
                    case 'admin':
                        roleAdmin=false;
                        break;
                }
            console.log({parseRes})
        } catch (error) {
            console.error(error)
        }
       
    }


    // ###delete a user
    // DELETE http://34.118.86.60:5000/api/admin/user/47482969-1d8c-4f31-8cd8-edee5dcbd27a
    // Content-Type: application/json
    // access_token: b03b3791f05b0f525f97d3101722f014790d34cb
    // refresh_token:nanananannaananan
    const removeUser= async()=>{
        try {
            const response=await fetch(`http://34.118.86.60:5000/api/admin/user/${user.id}`,{
				method:"DELETE",
				headers:{"Content-Type":"application/json","access_token":$access_token,"refresh_token":$refresh_token}
			})
			if(response.status>=300){
                const parseRes=await response.json()
                throw parseRes
            }
            console.log({response})
            const parseRes=await response.json()
            console.log({parseRes})
            user=null
            message=parseRes
        } catch (error) {
            console.error(error)
        }
    }



    $:if(addRoleAction){
        console.log({addRoleAction})
        addNewRole(addRoleAction)
    }
    $:if(removeRoleAction){
        console.log({removeRoleAction})
        removeRole(removeRoleAction)
}
    onMount(async () => {
        //setState for roles
        const roles = user.roles;
            for (const role of roles) {
                switch (role.name) {
                    case 'user':
                        roleUser=true;
                        break;
                    case 'eventOrganizer':
                        roleEventOrganizer=true;
                        break;
                    case 'admin':
                        roleAdmin=true;
                        break;
                }
            }
		});

</script>


{#if message}
    <li>{message}</li>
{/if}
{#if user}
    <li>
        user:{user.email}:
        {#if roleAdmin==false}
            <input type=radio bind:group={addRoleAction} value={{roleName:"admin",userId: user._id}}>
            Admin
        {:else}
            <input type=radio bind:group={removeRoleAction} value={{roleName:"admin",userId: user._id}}>
            ❌ Admin
        {/if}
        {#if roleUser==false}
            <input type=radio bind:group={addRoleAction} value={{roleName:"user",userId: user._id}}>
            User
        {:else}
            <input type=radio bind:group={removeRoleAction} value={{roleName:"user",userId: user._id}}>
            ❌ User
        {/if}
        {#if roleEventOrganizer==false}
            <input type=radio bind:group={addRoleAction} value={{roleName:"eventOrganizer",userId: user._id}}>
            Event Organizer
        {:else}
            <input type=radio bind:group={removeRoleAction} value={{roleName:"eventOrganizer",userId: user._id}}>
            ❌ Event Organizer
        {/if}
        <button on:click|once={removeUser}>  
            Remove this user💨
        </button>
    </li>
{/if}