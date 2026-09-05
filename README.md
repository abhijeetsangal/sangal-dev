# 💬 Realtime Chat App

A real-time, room-based chat application built with **Node.js**, **Express**, **Socket.io**, and **MongoDB**. Users can join named chat rooms, send messages instantly, see who else is online, and pick up past conversation history when they join.

**Live Demo:** [https://sangal-dev1.onrender.com](https://sangal-dev1.onrender.com)

---

## Features

- **Real-time messaging** via WebSockets (Socket.io) — messages appear instantly for everyone in the same room
- **Room-based chat** — join or switch between named rooms without leaving the app
- **Persistent history** — past messages are stored in MongoDB and loaded automatically when a user joins a room
- **Online users list** — see who's currently active in your room, updated live
- **Join/leave notifications** — get notified when someone enters or exits a room
- **Locked username** — set your name once (saved locally), then freely switch rooms without re-entering it
- **Recent rooms sidebar** — quickly rejoin rooms you've previously visited

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express |
| Real-time communication | Socket.io |
| Database | MongoDB (via Mongoose) |
| Frontend | HTML, CSS, vanilla JavaScript |

---

## How It Works

- The Express server serves static frontend files and exposes a `/messages` REST endpoint to fetch chat history for a given room.
- Socket.io handles real-time events: `join_chat`, `send_message`, `leave_chat`, and `disconnect`, using **Socket.io rooms** to scope broadcasts so messages only reach users in the same chat room.
- Every message is persisted to MongoDB via a Mongoose schema (`username`, `message`, `room`, `senderId`, `time`, `createdAt`), enabling chat history retrieval.
- The frontend uses `localStorage` to remember the user's chosen username and recently joined rooms across sessions.

---

## Running Locally

1. **Clone the repo**
   ```bash
   git clone https://github.com/abhijeetsangal/sangal-dev.git
   cd sangal-dev
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the project root:
   ```
   MONGODB_URI=your_mongodb_connection_string
   ```

4. **Start the server**
   ```bash
   node server.js
   ```

5. Open your browser to `http://localhost:3000`

---

## Project Structure

```
├── models/
│   └── Message.js       # Mongoose schema for chat messages
├── public/
│   └── index.html        # Frontend UI, styles, and client-side Socket.io logic
├── server.js              # Express server + Socket.io event handling
├── package.json
└── .gitignore
```

---

## Possible Future Additions

- Typing indicators
- User authentication (accounts instead of just usernames)
- Image/file sharing in messages
- Message read receipts

---

## Author

**Abhijeet Sangal**
[GitHub](https://github.com/abhijeetsangal) · [LinkedIn](https://www.linkedin.com/in/abhijeetsangal)
