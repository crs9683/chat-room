const socket = io();

const usernameContainer = document.getElementById('username-container');
const usernameInput = document.getElementById('username-input');
const usernameSubmit = document.getElementById('username-submit');
const chatContainer = document.getElementById('chat');
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const members = document.getElementById('members');

// Display chat history when received
socket.on('chat history', function(history) {
    history.forEach(function(msg) {
        const item = document.createElement('div');
        item.textContent = msg;
        messages.appendChild(item);
    });
    window.scrollTo(0, document.body.scrollHeight);
});

usernameSubmit.addEventListener('click', function() {
    const username = usernameInput.value.trim();
    if (username) {
        socket.emit('set username', username);
        usernameContainer.style.display = 'none';
        chatContainer.style.display = 'flex';
    }
});

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

socket.on('chat message', function(msg) {
    const item = document.createElement('div');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('members presence', function(membersList) {
    members.innerHTML = 'Online Members: ' + membersList.join(', ');
});