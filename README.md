# Tic-Tac-Toe Live
A two-player online Tic-Tac-Toe game using Express and Socket.IO.

## Run locally
Install Node.js 18+, run `npm install` then `npm start`, and open http://localhost:3000.

## Deploy
Push these files to a GitHub repository. Create a new Render Web Service connected to that repository. Set Build Command to `npm install` and Start Command to `npm start`. Render assigns a public HTTPS URL. Use a hosting plan that supports persistent Node.js servers and WebSockets. This app keeps rooms in server memory: use one instance; rooms and scores reset on server restart. For production durability and scaling, add shared storage and a Socket.IO adapter.

## Test
Open the deployed URL on one device, create a room, copy the invitation URL, open it on a second device and press Join game. Verify turn enforcement, win/draw detection and Play again. Do not use localhost for remote testing.
