// import { createLogin } from './login.js';
// import { loadUserProfile,loadXP,loadLevel,loadXPAndDisplayChart ,loadSkills} from './requetes.js';
// import { createHome } from './home.js';

// document.addEventListener('DOMContentLoaded', () => {
//   loadPage();
  
//   loadUserProfile();  
//   loadXP();  
//   loadLevel();  
//   loadXPAndDisplayChart()
//   loadSkills()

// });

// function loadLogin() {
//   const appContainer = document.getElementById('app');
//   const loginElement = createLogin();
//   appContainer.appendChild(loginElement);

//   const loginForm = document.getElementById('loginForm');
//   if (loginForm) {
//     loginForm.addEventListener('submit', authenticateUser);
//   } else {
//     console.error('Form with ID "loginForm" was not found.');
//   }
// }

// function getCredentialsFromForm() {
//   const username = document.getElementById('loginUsername').value;
//   const password = document.getElementById('loginPassword').value;
//   return { username, password };
// }

// async function getJWT() {
//   const signInEndpoint = 'https://adam-jerusalem.nd.edu/api/auth/signin';
//   const credentials = getCredentialsFromForm();
//   const base64Credentials = btoa(`${credentials.username}:${credentials.password}`);
//   const requestOptions = {
//     method: 'POST',
//     headers: {
//       'Authorization': `Basic ${base64Credentials}`,
//       'Content-type': 'application/json',
//     },
//   };

//   try {
//     const response = await fetch(signInEndpoint, requestOptions);
//     if (!response.ok) {
//       throw new Error('invalid credential');
//     }

//     const jsonResponse = await response.json();

//     if (!jsonResponse) {
//       throw new Error('Token is missing from JSON response');
//     }

//     return jsonResponse;
//   } catch (error) {
//     console.error(error.message);
//     throw error;
//   }
// }

// async function authenticateUser(event) {
//   event.preventDefault();
//   try {
//     const jwt = await getJWT();
//     console.log('JWT successfully obtained:', jwt);

//     localStorage.setItem('jwt', jwt);
//     loadPage();  
//     location.reload();
//   } catch (error) {
//     console.error('Error getting JWT:', error.message);

//     const loginErrorElement = document.getElementById('id-login-error');
//     if (loginErrorElement) {
//       loginErrorElement.textContent = `Error : ${error.message}`;
//       loginErrorElement.style.color = 'red';
//       loginErrorElement.style.display = 'block';
//     }
//   }
// }

// function loadPage() {
//   const appContainer = document.getElementById('app');

//   const jwt = localStorage.getItem('jwt');

//   if (jwt) {
//     const homeElement = createHome();
//     appContainer.innerHTML = '';
//     appContainer.appendChild(homeElement);

//     const logoutButton = document.getElementById('logoutButton');
//     if (logoutButton) {
//       logoutButton.addEventListener('click', logoutUser);
//     } else {
//       console.error('Logout button with ID "logoutButton" was not found.');
//     }
//   } else {
//     loadLogin();
//   }

// }



// export function logoutUser() {
//   const appContainer = document.getElementById('app');
//   appContainer.innerHTML = '';
//   loadLogin();
//   localStorage.removeItem('jwt');
// }

//===================================================

import { createLogin } from './login.js';
import { loadUserProfile,loadXP,loadLevel,loadXPAndDisplayChart ,loadSkills} from './requetes.js';
import { createHome } from './home.js';

document.addEventListener('DOMContentLoaded', () => {
  loadPage();
  
  loadUserProfile();  
  loadXP();  
  loadLevel();  
  loadXPAndDisplayChart()
  loadSkills()

});

function loadLogin() {
  const appContainer = document.getElementById('app');
  const loginElement = createLogin();
  appContainer.appendChild(loginElement);

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', authenticateUser);
  } else {
    console.error('Form with ID "loginForm" was not found.');
  }
}

function getCredentialsFromForm() {
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  return { username, password };
}

async function getJWT() {
  const signInEndpoint = 'https://adam-jerusalem.nd.edu/api/auth/signin';
  const credentials = getCredentialsFromForm();
  const base64Credentials = btoa(`${credentials.username}:${credentials.password}`);
  const requestOptions = {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${base64Credentials}`,
      'Content-type': 'application/json',
    },
  };

  try {
    const response = await fetch(signInEndpoint, requestOptions);
    if (!response.ok) {
      throw new Error('invalid credential');
    }

    const jsonResponse = await response.json();

    if (!jsonResponse) {
      throw new Error('Token is missing from JSON response');
    }

    return jsonResponse;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

async function authenticateUser(event) {
  event.preventDefault();
  try {
    const jwt = await getJWT();
    console.log('JWT successfully obtained:', jwt);

    localStorage.setItem('jwt', jwt);
    loadPage();  
    location.reload();
  } catch (error) {
    console.error('Error getting JWT:', error.message);

    const loginErrorElement = document.getElementById('id-login-error');
    if (loginErrorElement) {
      loginErrorElement.textContent = `Error : ${error.message}`;
      loginErrorElement.style.color = 'red';
      loginErrorElement.style.display = 'block';
    }
  }
}

function loadPage() {
  const appContainer = document.getElementById('app');

  const jwt = localStorage.getItem('jwt');

  if (jwt) {
    const homeElement = createHome();
    appContainer.innerHTML = '';
    appContainer.appendChild(homeElement);

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
      logoutButton.addEventListener('click', logoutUser);
    } else {
      console.error('Logout button with ID "logoutButton" was not found.');
    }
  } else {
    loadLogin();
  }

}



export function logoutUser() {
  const appContainer = document.getElementById('app');
  appContainer.innerHTML = '';
  loadLogin();
  localStorage.removeItem('jwt');
}