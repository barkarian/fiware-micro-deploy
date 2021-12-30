<script>
	import { page } from '$app/stores';
	import logo from './svelte-logo.svg';
	import {goto} from "$app/navigation"
	import {user,access_token,refresh_token,roleUser,roleAdmin,roleEventOrganizer,unseenNotifications} from '../../stores/store.js';
	const logOut=()=>{
		localStorage.clear()
        //setState
        user.set({})
        access_token.set(null)
        refresh_token.set(null)
		roleAdmin.set(null)
        roleEventOrganizer.set(null)
		roleUser.set(null)
		goto("/")
	}
</script>

<header>
	<div class="corner">
		<a href="https://kit.svelte.dev">
			<img src={logo} alt="SvelteKit" />
		</a>
	</div>

	<nav>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		<ul>
			<li class:active={$page.path === '/'}><a sveltekit:prefetch href="/">Home</a></li>
			{#if $roleAdmin}
				<li class:active={$page.path === '/admin-panel'}><a sveltekit:prefetch href="/admin-panel">Admin Panel</a></li>
			{/if}
			{#if $roleEventOrganizer}
				<li class:active={$page.path === '/manage-my-events'}><a sveltekit:prefetch href="/manage-my-events">Manage Events</a></li>
			{/if}
			{#if $roleUser}
				<li class:active={$page.path === '/concerts'}><a sveltekit:prefetch href="/concerts">Concerts</a></li>
				<li class:active={$page.path === '/favorites'}><a sveltekit:prefetch href="/favorites">Favorites</a></li>
				<li class:active={$page.path === '/subscribed'}><a sveltekit:prefetch href="/subscribed">Subscribed</a></li>
				<li class:active={$page.path === '/notifications'}><a sveltekit:prefetch href="/notifications">Notifications
				{#if $unseenNotifications}
					📥
				{/if}
				</a></li>
			{/if}
			{#if $access_token}
				<li class:active={$page.path === '/profile'}><a sveltekit:prefetch href="/profile">Profile</a></li>
				<li on:click={logOut}><a sveltekit:prefetch href="/">Log out</a></li>
					<!-- <li on:click={logOut}>Log Out</li> -->
			{:else}
				<li class:active={$page.path === '/sign-in'}><a sveltekit:prefetch href="/sign-in">Sign in</a></li>
				<li class:active={$page.path === '/sign-up'}><a sveltekit:prefetch href="/sign-up">Sign up</a></li>
			{/if}
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>

	<div class="corner">
		<!-- TODO put something else here? github link? -->
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	.corner {
		width: 3em;
		height: 3em;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}

	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li.active::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--accent-color);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 1em;
		color: var(--heading-color);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--accent-color);
	}
</style>
