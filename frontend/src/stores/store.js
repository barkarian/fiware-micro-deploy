import { writable } from 'svelte/store';

export const isAuthenticated = writable(false); //initialize state
export const user = writable({});
export const access_token = writable(null);
export const refresh_token = writable(null);
export const roleAdmin = writable(false);
export const roleUser = writable(false);
export const roleEventOrganizer = writable(false);

export const viewEvent = writable(null);
export const unseenNotifications = writable(null);
