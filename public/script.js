const socket = io();
const joinBtn = document.getElementById('joinBtn');
const nicknameInput = document.getElementById('nickname');
const passwordInput = document.getElementById('password'); // optional für Admin
const activeDiv = document.getElementById('active-players');
const chatInput = document.getElementById('chat-input');
const chatBtn = document.getElementById('chat-btn');
const chatBox = document.getElementById('chat-box');

joinBtn.addEventListener('click', () => {
    if(!nicknameInput.value) return alert("Nickname eingeben!");
    socket.emit('join', { nickname: nicknameInput.value, password: passwordInput.value || '' });
});

socket.on('nickname-error', msg => alert(msg));

socket.on('lobby-update', data => {
    const { count, displayNames } = data;
    activeDiv.innerHTML = `<h3>Spieler online: ${count}</h3>` + displayNames.map(n => `<div>${n}</div>`).join('');
});

// Chat senden
chatBtn.addEventListener('click', () => {
    if(!chatInput.value) return;
    socket.emit('chat-message', chatInput.value);
    chatInput.value = '';
});

// Chat empfangen
socket.on('chat-message', ({name, message, isAdmin}) => {
    const div = document.createElement('div');
    div.innerHTML = `${isAdmin ? '<span class="admin">' + name + ' (Admin)</span>' : name}: ${message}`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
});
