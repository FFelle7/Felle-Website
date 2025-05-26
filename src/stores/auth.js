import { writable } from 'svelte/store';

export const isLoggedIn = writable(localStorage.getItem('isLoggedIn') === 'true');
export const currentUser = writable(JSON.parse(localStorage.getItem('currentUser') || 'null'));

isLoggedIn.subscribe(value => {
  localStorage.setItem('isLoggedIn', value);
});

currentUser.subscribe(value => {
  if (value) {
    localStorage.setItem('currentUser', JSON.stringify(value));
  } else {
    localStorage.removeItem('currentUser');
  }
});
