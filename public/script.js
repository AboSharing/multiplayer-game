const socket = io();
const joinBtn = document.getElementById('joinBtn');
const nicknameInput = document.getElementById('nickname');
const leaderboardDiv = document.getElementById('leaderboard');
const gameButtons = document.querySelectorAll('.game-btn');

let nickname = '';

// Lobby beitreten
joinBtn.addEventListener('click', () => {
  if(!nicknameInput.value) return alert("Bitte Nickname eingeben!");
  nickname = nicknameInput.value;
  socket.emit('join', nickname);
});

// Spiel auswählen
gameButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    if(!nickname) return alert("Bitte zuerst Nickname eingeben!");
    const game = btn.dataset.game;
    if(game === "comingsoon") return alert("Dieses Spiel kommt bald!");
    window.location.href = `/games/${game}.html?nickname=${nickname}`;
  });
});

// Leaderboard aktualisieren
socket.on('leaderboard', data => {
  leaderboardDiv.innerHTML = '';
  const sorted = Object.entries(data).sort((a,b) => b[1].totalScore - a[1].totalScore);
  sorted.slice(0,10).forEach(([name, info], i) => {
    const div = document.createElement('div');
    div.textContent = `${i+1}. ${name}: ${info.totalScore} Punkte`;
    leaderboardDiv.appendChild(div);
  });
});
