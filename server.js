const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

socket.addEventListener('open', function (event) {
    console.log('Connected to WebSocket server');
    socket.send('Hello Server!');
});

socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
    // Handle incoming messages and update the UI accordingly
});

socket.addEventListener('close', function (event) {
    console.log('Disconnected from WebSocket server');
});

socket.addEventListener('error', function (event) {
    console.error('WebSocket error:', event);
});

// Function to send a message to the server
function sendMessage(message) {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(message);
    } else {
        console.error('WebSocket is not open. ReadyState: ' + socket.readyState);
    }
}

// Example: Sending a message when a sidebar link is clicked
document.querySelectorAll('.sidebar a').forEach(link => {
    link.addEventListener('click', () => {
        sendMessage('Link clicked: ' + link.textContent);
    });
});

const apiUrl = 'http://localhost:5501/';

async function fetchThreads() {
    const response = await fetch(apiUrl + 'threads');
    const threads = await response.json();
    const threadList = document.getElementById('threadList');
    threadList.innerHTML = '';

    threads.forEach(thread => {
        const li = document.createElement('li');
        li.textContent = thread.content;
        threadList.appendChild(li);
    });
}


function displayHeadline(headline) {
    const headlineDiv = document.createElement('div');
    headlineDiv.classList.add('headline');

    const title = document.createElement('h2');
    title.textContent = headline.title;
    headlineDiv.appendChild(title);

    const image = document.createElement('img');
    image.src = headline.image;
    headlineDiv.appendChild(image);

    headlinesContainer.appendChild(headlineDiv);
}

const socket = new WebSocket('ws://localhost:5501');

socket.onmessage = function(event) {
    const thread = JSON.parse(event.data);
    const threadList = document.getElementById('threadList');
    const li = document.createElement('li');
    li.textContent = thread.content;
    threadList.appendChild(li);
};

fetchThreads();

server.listen(5501, () => {
    console.log('WebSocket server started on port 5501');
});


