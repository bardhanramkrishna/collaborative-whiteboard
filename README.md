# DrawTogether 🎨

DrawTogether is a production-grade real-time collaborative whiteboard application. Multiple users can join the same room and draw together simultaneously — any stroke, shape, or change made by one user instantly appears on all connected screens. Features room-based collaboration, live cursor tracking, persistent drawing storage, and a built-in chat system. Stack: React · Node.js · Socket.IO · MongoDB Atlas · Tailwind CSS

---

## 🔗 Live Demo

**Frontend:** https://drawtogether-frontend-5sd3.onrender.com  
**Backend API:** https://collaborative-whiteboard-nk5s.onrender.com

---

## Demo

> Create a room → share the code → draw together in real time

---

## How It Works

```
User creates or joins a room
       ↓
Unique 8-character room code generated
       ↓
Socket.IO connects user to room namespace
       ↓
Drawing events emit from canvas
  Freehand pen  → draw event → broadcast to all users in room
  Shapes        → shape-draw event → broadcast with coordinates
  Eraser        → erase event → destination-out composite
  Undo/Redo     → sync across all connected clients
       ↓
Board state saved to MongoDB Atlas on demand
       ↓
Rejoining a room reloads the saved drawing state
       ↓
Live chat messages broadcast via Socket.IO to all room members
       ↓
Live cursors track and display all users' mouse positions
```

---

## Features

- **Real-time sync** — drawing updates appear in under 50ms for all users in the room via Socket.IO WebSocket events
- **7 drawing tools** — freehand pen, straight line, rectangle, circle, arrow, eraser, and select tool
- **Shape preview** — shapes render on an overlay canvas while dragging, committed to main canvas on mouse up
- **Persistent boards** — drawing state saved to MongoDB Atlas and reloaded when rejoining a room
- **Live cursors** — every connected user's cursor position streams in real time with their username label
- **Room-based chat** — built-in chat panel with system messages for join/leave events, unread badge, and auto-scroll
- **Export** — download the whiteboard as PNG or PDF with one click
- **Share modal** — copy room link, share via X (Twitter), Gmail, or WhatsApp
- **Analytics dashboard** — total rooms, active rooms, saved boards, and total drawings from MongoDB
- **Undo/Redo** — synced across all users in the room
- **Color picker** — 12 preset colors plus a custom color input
- **Brush size** — 5 preset sizes plus a slider for fine control
- **Toast notifications** — join, leave, save, and clear events shown as non-intrusive toasts

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend                           │
│  HomePage → RoomPanel → WhiteboardPage                      │
│  Canvas (HTML5) · Toolbar · ColorPicker · BrushSize         │
│  Chat · LiveCursors · ExportMenu · ShareModal               │
│  Analytics Dashboard (Recharts)                             │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP REST + Socket.IO WebSocket
┌──────────────────────────▼──────────────────────────────────┐
│                   Node.js + Express Backend                  │
│                                                              │
│  REST API                                                    │
│  POST /api/rooms/create   → generate unique room code       │
│  GET  /api/rooms/:roomId  → fetch room details              │
│  POST /api/rooms/join     → join or auto-create room        │
│  POST /api/boards/save    → persist drawing state           │
│  GET  /api/boards/:roomId → reload saved drawings           │
│  GET  /api/rooms/stats/all  → analytics                     │
│  GET  /api/boards/stats/all → analytics                     │
│                                                              │
│  Socket.IO Events                                            │
│  join-room · draw · shape-draw · erase                      │
│  undo · redo · clear-board · cursor-move · chat-message     │
└──────────┬──────────────────────────────────────────────────┘
           │
┌──────────▼──────────┐
│   MongoDB Atlas      │
│  Rooms · Boards      │
│  Drawing history     │
└─────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Create React App |
| Styling | Tailwind CSS v3 |
| Drawing | HTML5 Canvas API |
| Real-time | Socket.IO Client |
| Charts | Recharts |
| Export | jsPDF |
| Icons | Lucide React |
| Routing | React Router v6 |
| Backend | Node.js, Express |
| WebSockets | Socket.IO |
| Database | MongoDB Atlas, Mongoose |
| Notifications | React Hot Toast |
| Deployment | Render (backend + frontend) |

---

## Project Structure

```
collaborative-whiteboard/
├── client/
│   ├── public/
│   │   └── _redirects           # Render SPA routing fix
│   └── src/
│       ├── components/
│       │   ├── Canvas.jsx        # HTML5 Canvas — draw, shape, erase, preview
│       │   ├── Toolbar.jsx       # Tool selector, undo, redo, clear
│       │   ├── ColorPicker.jsx   # 12 presets + custom color input
│       │   ├── BrushSize.jsx     # 5 presets + range slider
│       │   ├── RoomInfo.jsx      # Room code display + active users
│       │   ├── Chat.jsx          # Real-time chat panel with unread badge
│       │   ├── LiveCursors.jsx   # Other users' cursor positions
│       │   ├── ExportMenu.jsx    # PNG and PDF export
│       │   ├── ShareModal.jsx    # Copy link, X, Gmail, WhatsApp
│       │   ├── SaveButton.jsx    # Save board to MongoDB
│       │   ├── HomeHero.jsx      # Landing page hero section
│       │   ├── RoomPanel.jsx     # Create/join room UI
│       │   └── Navbar.jsx        # Top navigation bar
│       ├── hooks/
│       │   ├── useSocket.js      # Socket.IO connection + all event handlers
│       │   ├── useCanvas.js      # Canvas ref and resize utilities
│       │   └── useHistory.js     # Undo/redo history state
│       ├── pages/
│       │   ├── HomePage.jsx      # Landing page
│       │   ├── Analytics.jsx     # Analytics dashboard
│       │   └── Whiteboard/
│       │       └── WhiteboardPage.jsx  # Main whiteboard with all features
│       └── config.js             # Dynamic server URL (local vs production)
├── server/
│   ├── config/
│   │   └── db.js                 # MongoDB Atlas connection
│   ├── models/
│   │   ├── Room.js               # Room schema
│   │   └── Board.js              # Board + drawing schema
│   ├── routes/
│   │   ├── rooms.js              # Room REST endpoints
│   │   └── boards.js             # Board REST endpoints
│   ├── socket/
│   │   └── socketHandler.js      # All Socket.IO events + chat history
│   └── index.js                  # Express app + Socket.IO server
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account — free at [mongodb.com/atlas](https://mongodb.com/atlas)

### 1. Clone the repo

```bash
git clone https://github.com/bardhanramkrishna/collaborative-whiteboard.git
cd collaborative-whiteboard
```

### 2. Backend setup

```powershell
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/whiteboard?retryWrites=true&w=majority
CLIENT_URL=http://localhost:3000
```

```powershell
npm run dev
```

### 3. Frontend setup

```powershell
cd client
npm install
```

Create `client/.env`:

```env
REACT_APP_SERVER_URL=http://localhost:5000
```

```powershell
npm start
```

### 4. Open the app

```
http://localhost:3000
```

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `MONGO_URI` | MongoDB Atlas connection string | ✅ |
| `PORT` | Server port (default 5000) | ❌ |
| `CLIENT_URL` | Frontend URL for CORS | ✅ prod |
| `REACT_APP_SERVER_URL` | Backend URL for API + Socket.IO | ✅ |

---

## Deployment

### Backend → Render Web Service

```
Runtime:       Node
Root Directory: server
Build Command: npm install
Start Command: node index.js
```

Environment variables:
```
MONGO_URI    = your MongoDB Atlas URI
CLIENT_URL   = https://your-frontend.onrender.com
PORT         = 10000
```

### Frontend → Render Static Site

```
Root Directory:   client
Build Command:    npm install && npm run build
Publish Directory: build
```

Environment variables:
```
REACT_APP_SERVER_URL = https://your-backend.onrender.com
```

> ⚡ **Free tier note:** Services spin down after 15 minutes of inactivity. Add [UptimeRobot](https://uptimerobot.com) pointing to `/api/health` to keep the backend warm.

---

## Socket.IO Events

| Direction | Event | Payload |
|---|---|---|
| Client → Server | `join-room` | `{ roomId, username }` |
| Client → Server | `draw` | `{ roomId, tool, color, brushSize, points }` |
| Client → Server | `shape-draw` | `{ roomId, tool, color, startX, startY, endX, endY }` |
| Client → Server | `erase` | `{ roomId, points, brushSize }` |
| Client → Server | `undo` | `{ roomId }` |
| Client → Server | `redo` | `{ roomId }` |
| Client → Server | `clear-board` | `{ roomId }` |
| Client → Server | `cursor-move` | `{ roomId, x, y, username }` |
| Client → Server | `chat-message` | `{ roomId, username, message, time }` |
| Server → Client | `user-joined` | `{ username, activeUsers }` |
| Server → Client | `user-left` | `{ username, activeUsers }` |
| Server → Client | `drawing-update` | drawing object |
| Server → Client | `board-cleared` | — |
| Server → Client | `active-users` | `{ activeUsers }` |
| Server → Client | `cursor-update` | `{ socketId, x, y, username }` |
| Server → Client | `chat-message` | `{ type, username, message, time }` |
| Server → Client | `chat-history` | array of last 50 messages |

---

## What This Demonstrates

Real-time collaborative applications are among the most technically challenging portfolio projects. DrawTogether shows you understand:

- **WebSocket architecture** — Socket.IO rooms, namespaces, event broadcasting
- **Canvas API** — freehand drawing, shape rendering, erasing, redraw on state change
- **State synchronization** — keeping multiple clients in sync without conflicts
- **Dual-canvas technique** — overlay canvas for shape preview, main canvas for committed drawings
- **MongoDB integration** — persisting and reloading complex nested drawing data
- **Full-stack deployment** — separate frontend and backend on Render with environment-based config
- **React performance** — useRef, useCallback, and refs for canvas to avoid stale closures

---

## Author

**Ramkrishna Bardhan**
- GitHub: [@bardhanramkrishna](https://github.com/bardhanramkrishna)

---

## License

MIT License — fork, extend, build on top of this.