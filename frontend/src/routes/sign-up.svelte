<script>
    import {user,access_token,refresh_token,roleUser,roleAdmin,roleEventOrganizer} from '../stores/store.js';
    import {goto} from "$app/navigation"
    let userCredentials={
    }
    let displayError=null;
    const handleClick = async (userCredentials)=>{
        // ###create the app-admin
        // POST http://34.118.86.60:5000/auth/create-user
        // Content-Type: application/json

        //{"name":"appAdmin","surname":"appAdminSur","username":"appAdmin","email":"app-admin@gmail.com","password":"password123"}
        console.log(userCredentials)
        try {
            const response=await fetch("http://34.118.86.60:5000/auth/create-user",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(userCredentials)
            })
            console.log(response)
            if(response.status>=300){
                const parseRes=await response.json()
                throw parseRes
            }
            const parseRes=await response.json()
            console.log(parseRes)
            localStorage.setItem("access_token",parseRes.access_token)
            localStorage.setItem("refresh_token",parseRes.refresh_token)
            const user_stringify=JSON.stringify(parseRes.user)
            localStorage.setItem("user",user_stringify)
            //setState
            user.set(parseRes.user)
            access_token.set(parseRes.access_token)
            refresh_token.set(parseRes.refresh_token)
            //set roles
            const roles = parseRes.user.roles;
            for (const role of roles) {
				switch (role.name) {
					case 'user':
						roleUser.set(true)
						break;
					case 'eventOrganizer':
						roleEventOrganizer.set(true)
						break;
					case 'admin':
						roleAdmin.set(true)
						break;
				}
			}
            goto("/profile")
        }catch(err){
                displayError=err
        }
    }
</script>

{#if displayError}
    <p>{displayError}</p>
{/if}
<form on:submit|preventDefault={handleClick(userCredentials)}>
    <input type="text" name="name" placeholder="name" bind:value={userCredentials.name}/>
    <input type="text" name="surname" placeholder="surname" bind:value={userCredentials.surname}/>
    <input type="text" name="username" placeholder="username" bind:value={userCredentials.username}/>
    <input type="email" name="email" placeholder="email" bind:value={userCredentials.email}/>
    <input type="password" name="password" placeholder="password" bind:value={userCredentials.password}/>
    <button >Submit</button>
</form>