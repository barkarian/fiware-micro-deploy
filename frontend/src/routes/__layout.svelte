<script>
	import Header from '$lib/header/Header.svelte';
	import '../app.css';
	import {user,access_token,refresh_token,roleUser,roleAdmin,roleEventOrganizer,unseenNotifications} from '../stores/store';
	import { beforeUpdate } from 'svelte';

	const getDataFromAccessToken=async(access_token_data,refresh_token_data)=>{
		try {
			// ###get user data
			// POST http://34.118.86.60:5000/auth/user-data
			// Content-Type: application/json

			// {"access_token":"3a1273ff949dd6bc3d42b37e0ff27a3114c9ae2c","refresh_token":"nannananann"}
			const response=await fetch("http://34.118.86.60:5000/auth/user-data",{
					method:"POST",
					headers:{"Content-Type":"application/json"},
					body:JSON.stringify({access_token:access_token_data,refresh_token:refresh_token_data})
				})
				if(response.status>=300){
					localStorage.clear()
					//setState
					user.set({})
					access_token.set(null)
					refresh_token.set(null)
					throw response.body 
				}
				const parseRes=await response.json()
				// console.log({parseRes})
				//localStorage is a key value set that takes only strings as parameters
				localStorage.setItem("access_token",parseRes.access_token)
				localStorage.setItem("refresh_token",parseRes.refresh_token)
				const user_stringify=JSON.stringify(parseRes.user)
				localStorage.setItem("user",user_stringify)
				//setState
				user.set(parseRes.user)
				access_token.set(parseRes.access_token)
				refresh_token.set(parseRes.refresh_token)
				//get new notifications
				// console.log($unseenNotifications)
				// console.log(parseRes.user.notifications.filter(e=>e.notifSeen==false))
				console.log({unseen_notification_are:$unseenNotifications})
				if(parseRes.user.notifications.filter(e=>e.notifSeen==false).length>0){
					unseenNotifications.set(parseRes.user.notifications.filter(e=>e.notifSeen==false))
				}
				return parseRes.user
		} catch (error) {
			console.error(error)
		}
	}

	beforeUpdate(async () => {
		const access_token_data=localStorage.getItem("access_token")
		const refresh_token_data=localStorage.getItem("refresh_token")
		const userData=await getDataFromAccessToken(access_token_data,refresh_token_data)
		//setState for roles
		const roles = userData.roles;
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
			
		});
</script>

<Header />

<main>
	<slot />
</main>

<footer>
	<p>Visit <a href="https://github.com/barkarian">my github</a> for more of my projects</p>
</footer>

<style>
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 1024px;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 40px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 40px 0;
		}
	}
</style>
