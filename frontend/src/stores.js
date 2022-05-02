import { writable } from 'svelte/store';
import cookies from 'js-cookie';

const cookie = cookies.get('token');
if (cookie) {
  window.localStorage.setItem('token', cookie);
  cookies.remove('token', { sameSite: 'lax' });
}
const _token = cookie || window.localStorage.getItem('token');

export const token = writable(_token);
export const path = writable(window.location.hash.slice(1) || '/list');
export const current = writable();