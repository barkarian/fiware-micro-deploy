<script>
    import {user,access_token,refresh_token,roleUser,roleAdmin,roleEventOrganizer} from '../stores/store.js';
    import {goto} from "$app/navigation"
    let userCredentials={
        password:"",
        email:""
    }
    let displayError=null;
    const handleClick = async (userCredentials)=>{
        // POST http://34.118.86.60:5000/auth/login
        // Content-Type: application/json

        // {"email":"email1@gmail.com","password":"password123"}
        console.log(API_URL)
        try {
            const response=await fetch("http://34.118.86.60:5000/auth/login",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(userCredentials)
            })
            if(response.status>=300){
                const parseRes=await response.json()
                throw parseRes
            }
            const parseRes=await response.json()
            console.log({parseRes})
            //localStorage is a key value set that takes only strings as parameters
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
    <input type="email" name="email" placeholder="email" bind:value={userCredentials.email}/>
    <input type="password" name="password" placeholder="password" bind:value={userCredentials.password}/>
    <button >Submit</button>
</form>