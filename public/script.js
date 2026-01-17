const socket = io(); // Socket.io Verbindung
const startBtn = document.getElementById('start-btn');
const testBtn = document.getElementById('test-btn');
const nicknameInput = document.getElementById('nickname');
const leaderboardEl = document.getElementById('leaderboard');

let nickname = '';

// Nickname festlegen
startBtn.addEventListener('click', () => {
  if(nicknameInput.value.trim() === '') return alert('Bitte Nickname eingeben!');
  nickname = nicknameInput.value.trim();
  socket.emit('join', nickname);
  alert(`Nickname gesetzt: ${nickname}`);
});

// Testbutton: +10 Punkte
testBtn.addEventListener('click', () => {
  if(!nickname) return alert('Setze zuerst deinen Nickname!');
  socket.emit('score', {nickname, points: 10});
});

// Leaderboard live aktualisieren
socket.on('leaderboard', data => {
  leaderboardEl.innerHTML = '';
  Object.keys(data).forEach(player => {
    const li = document.createElement('li');
    li.textContent = `${player}: ${data[player].score} Punkte`;
    leaderboardEl.appendChild(li);
  });
});
