/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { signup } from './signUp';

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.login-form');
const signUpForm = document.querySelector('.signUp-form');
const logOutBtn = document.querySelector('.nav__el--logout');

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (signUpForm) {
  signUpForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const photo = document.getElementById('photo').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    signup(name, email, photo, password, passwordConfirm);
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', event => {
  	event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  	login(email, password);
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);
