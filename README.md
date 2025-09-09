# ChronoMate ToDos Application

ChronoMate is a full-stack productivity app for managing tasks, events, notes, and checklists, featuring a smart AI assistant (ChatBot) to help organize your day. It includes a web client, RESTful server, and desktop app.

## Project Structure

```
README.md
client/
  ├─ eslint.config.js
  ├─ index.html
  ├─ package.json
  ├─ vercel.json
  ├─ vite.config.js
  ├─ public/
  │    ├─ background.jpg
  │    └─ todos.png
  ├─ src/
  │    ├─ App.css
  │    ├─ App.jsx
  │    ├─ Dummy.jsx
  │    ├─ index.css
  │    ├─ main.jsx
  │    ├─ api/
  │    │    └─ axiosInstance.js
  │    ├─ assets/
  │    │    └─ react.svg
  │    ├─ components/
  │    │    └─ Transitions.jsx
  │    ├─ hooks/
  │    │    ├─ AuthContext.jsx
  │    │    ├─ AuthProvider.jsx
  │    │    ├─ PushContext.jsx
  │    │    ├─ PushProvider.jsx
  │    │    ├─ SidebarContext.jsx
  │    │    ├─ SidebarProvider.jsx
  │    │    ├─ ToastContext.jsx
  │    │    └─ ToastProvider.jsx
  │    ├─ modules/
  │    │    ├─ todos/
  │    │    │    ├─ event/
  │    │    │    │    └─ CreateEvent.jsx
  │    │    │    ├─ list/
  │    │    │    │    └─ CreateList.jsx
  │    │    │    ├─ note/
  │    │    │    │    └─ CreateNote.jsx
  │    │    │    └─ task/
  │    │    │         └─ CreateTask.jsx
  │    │    ├─ Users/
  │    │    │    ├─ ForgotPassword.jsx
  │    │    │    ├─ Login.jsx
  │    │    │    ├─ Register.jsx
  │    │    │    ├─ UpdatePassword.jsx
  │    │    │    └─ View.jsx
  │    ├─ pages/
  │    │    ├─ Home.jsx
  │    │    ├─ Welcome.jsx
  │    │    └─ errors/
  │    │         ├─ NotFound.jsx
  │    │         └─ Unauthorized.jsx
  │    ├─ routes/
  │    │    └─ PrivateRoute.jsx
  │    └─ shared/
  │         ├─ ChatBot.jsx
  │         ├─ Footer.jsx
  │         ├─ Navbar.jsx
  │         └─ Sidebar.jsx

desktop/
  ├─ main.js
  ├─ package.json
  └─ assets/
       └─ icon.ico

server/
  ├─ index.js
  ├─ package.json
  ├─ vercel.json
  ├─ controllers/
  │    ├─ AuthController.js
  │    ├─ ChatController.js
  │    ├─ EventContoller.js
  │    ├─ ListController.js
  │    ├─ NoteController.js
  │    ├─ TaskController.js
  │    └─ UserController.js
  ├─ middleware/
  │    └─ AuthMiddleware.js
  ├─ models/
  │    ├─ ChatHistoryModel.js
  │    ├─ EventCounter.js
  │    ├─ EventModel.js
  │    ├─ ListConuter.js
  │    ├─ ListCounter.js
  │    ├─ ListModel.js
  │    ├─ NoteCounter.js
  │    ├─ NoteModel.js
  │    ├─ TaskCounter.js
  │    ├─ TaskModel.js
  │    └─ UserModel.js
  ├─ resources/
  │    ├─ events_john.wick@todos.com.csv
  │    ├─ lists_john.wick@todos.com.csv
  │    ├─ notes_john.wick@todos.com.csv
  │    ├─ tasks_john.wick@todos.com.csv
  │    └─ todosDb.events.json
  ├─ routes/
  │    ├─ AuthRoute.js
  │    ├─ ChatRoutes.js
  │    ├─ EventRoute.js
  │    ├─ ListRoute.js
  │    ├─ NoteRoute.js
  │    ├─ TaskRoute.js
  │    └─ UserRoute.js
```

## Features

- User authentication (register, login, password update, forgot password)
- Create, view, update, and delete:
  - Tasks
  - Events
  - Notes
  - Lists/Checklists
- AI ChatBot ("ChronoMate") for personalized productivity assistance
- Push notifications for daily events
- Responsive UI with dark/light mode
- CSV export for user data
- RESTful API backend (Node.js/Express/MongoDB)
- Desktop app (Electron)

## Technologies Used

- **Frontend:** React, Vite, TailwindCSS, DaisyUI, Framer Motion, Axios
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Web Push, Google GenAI
- **Desktop:** Electron
- **Other:** ESLint, dotenv

## Installation

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Clone the repository

```sh
git clone https://github.com/Babai8899/to-dos.git
cd to-dos
```

### Install dependencies

#### Client

```sh
cd client
npm install
```

#### Server

```sh
cd ../server
npm install
```

#### Desktop

```sh
cd ../desktop
npm install
```

## Usage

### Start the server

```sh
cd server
npm run dev
```

### Start the client

```sh
cd ../client
npm run dev
```

### Start the desktop app

```sh
cd ../desktop
npm start
```

## Scripts

- `client`
  - `npm run dev` - Start development server
  - `npm run build` - Build for production
  - `npm run preview` - Preview production build
  - `npm run lint` - Lint code
- `server`
  - `npm run dev` - Start server with nodemon
  - `npm start` - Start server
- `desktop`
  - `npm start` - Run Electron app
  - `npm run build` - Build desktop app

## Environment Variables

Create `.env` files in `client` and `server` folders for configuration (API URLs, MongoDB URI, JWT secret, etc.).

## License

ISC

## Author

Indranil Dhara (indra.babai.9898@gmail.com)
