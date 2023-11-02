import './services/auth.js';
import { signIn, signOut, signUp, watchAuth } from './services/auth.js';
import { startSession } from './session.js';

const authSection = document.getElementById('auth-section');
const sessionSection = document.getElementById('session-section');
const hide = element => element.classList.add('hidden');
const show = element => element.classList.remove('hidden');
const authMode = () => { 
    show(authSection);
    hide(sessionSection); 
    hide(signOutButton); 
};
const sessionMode = () => { 
    hide(authSection);
    show(sessionSection); 
    show(signOutButton); 
};

const authForm = document.getElementById('auth-form');
const authError = document.getElementById('auth-error');
authForm.addEventListener('submit', async e => {
    e.preventDefault();
    const action = e.submitter.name === 'sign-up' ? signUp : signIn;

    const formData = new FormData(authForm);
    const credentials = Object.fromEntries(formData.entries());
    const { error } = await action(credentials);
    if (error) {
        authError.textContent = error?.message ?? error ?? 'Unexpected error';
    }
});

const signOutButton = document.getElementById('sign-out-button');
signOutButton.addEventListener('click', signOut);

const startButton = document.getElementById('start-button');
startButton.addEventListener('click', startSession);

watchAuth((_event, session) => {
    session ? sessionMode() : authMode();
});