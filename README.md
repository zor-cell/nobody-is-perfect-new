# Nobody is perfect
This project is a game assistant for the board game **Nobody is perfect**. You can read a post on my blog about it [here](https://zor-blog.netlify.app/blog/2023-08-31-nobody-is-perfect-game-assistant/).

The project uses the **socket.io** library for websocket functionality. because of this, the project is split into frontend and backend.

## Frontend
The frontend is styled using plain **HTML5** and **CSS** and the user interface is implemented using the **React.js** framework.
A local server can be used for testing, which is created using a **node.js** live-server.

The frontend client communicates with the backend server, to allow for multi-user interaction. It is hosted using **Netlify**.

## Backend
The backend is a **node.js** application, which handles all websocket initialisation and communication. The backend server is hosted using **Heroku**.

## Developement Usage
Start local development client: **frontend/npm run start**.
Start local development server: **backend/npm run serve**.

## TODO
[x] create room
[x] join room
[x] leave room
[ ] set username
[ ] show all active users
[ ] heroku url in .env file
[ ] store socket data in localhost
[ ]  
