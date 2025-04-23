// localStorage.js

// Function to get stored user data
export function getStoredUser() {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  }
  
  // Function to store a new user
  export function storeUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
  
  // Function to check if the user is logged in
  export function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
  
  // Function to log the user in
  export function loginUser() {
    localStorage.setItem('isLoggedIn', 'true');
  }
  
  // Function to log the user out
  export function logoutUser() {
    localStorage.removeItem('isLoggedIn');
  }
  