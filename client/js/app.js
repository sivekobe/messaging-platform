let socket;
let token;

async function register() {
  const username = document.getElementById('registerUsername').value;
  const password = document.getElementById('registerPassword').value;
  await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  alert('User registered');
}

async function login() {
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await response.json();
  token = data.token;
  document.getElementById('chat').style.display = 'block';
  socket = new WebSocket(`ws://${window.location.host}`);
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    const messages = document.getElementById('messages');
    messages.innerHTML += `<p><strong>${message.sender}:</strong> ${message.content}</p>`;
  };
}

function sendMessage() {
  const content = document.getElementById('messageInput').value;
  const message = JSON.stringify({ sender: 'User', content });
  socket.send(message);
}

async function uploadFile() {
  const fileInput = document.getElementById('fileInput');
  const formData = new FormData();
  formData.append('file', fileInput.files[0]);
  const response = await fetch('/api/files', {
    method: 'POST',
    body: formData,
  });
  const data = await response.json();
  alert(`File uploaded: ${data.filePath}`);
}
