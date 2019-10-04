# Chat System

This was created as an assignment for 2811ICT at Griffith University.

## (Anti-)Features

 - Plaintext password storage
 - Clientside verified permissions
 - Polling for permissions updates
 - Database resource leaks
 
i.e. this thing is **not** designed to run in a production environment whatsoever. It exists
purely to demonstrate simple client-server interactions and responsive SPA frontend techniques.

## Running

### Server

```bash
cd server
npm install
npm start
```

### Client

```bash
npm install -g @angular/cli
npm install
ng serve
```

Alternatively, you can `ng build` the frontend before running the server, then navigate to the
root of the server in a browser (e.g. `http://localhost:3000/`), in order to serve all resources
from one place.
