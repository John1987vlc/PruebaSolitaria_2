# Card‑Game‑JS

> A lightweight, browser‑based card game inspired by *Magic: The Gathering* that runs entirely with HTML, CSS and vanilla JavaScript.  
> The project demonstrates a full‑stack approach using a minimal Python 3.12 backend for serving assets and persisting game state.

---

## 1. Project Overview & Value Proposition

**Card‑Game‑JS** is a turn‑based card game that lets players build decks, manage mana, and engage in combat—all without any external images or heavy frameworks.  
Key benefits:

- **Zero‑dependency front‑end** – pure HTML/CSS/JS, making it fast to load and easy to audit.  
- **Python 3.12 backend** – lightweight server that handles deck persistence, matchmaking, and real‑time updates via WebSocket.  
- **Modular architecture** – clean separation of concerns, facilitating future feature expansion (e.g., multiplayer, card rarity, AI opponents).  
- **Educational value** – perfect starter kit for developers learning game logic, state management, and web sockets.

---

## 2. Key Features

- **Deck Builder** – drag‑and‑drop cards, enforce deck size limits, and export/import deck JSON.  
- **Mana System** – dynamic mana pool that regenerates each turn; cards consume mana to play.  
- **Combat Engine** – attack, block, and damage resolution with simple hit‑point mechanics.  
- **Turn‑Based Flow** – phases: draw, main, combat, end.  
- **Responsive UI** – works on desktop and mobile browsers.  
- **WebSocket Sync** – real‑time opponent updates for multiplayer mode.  
- **Persisted Game State** – server stores active games and player decks in a lightweight SQLite DB.  
- **Open‑Source MIT License** – free to modify and distribute.

---

## 3. Visual / Architecture Overview

```
┌───────────────────────┐
│      Browser Client    │
│  (index.html, style.css, game.js) │
└───────┬───────────────┘
        │ WebSocket / HTTP
        ▼
┌───────────────────────┐
│   Python 3.12 Server   │
│  (server.py, routes.py)│
│  • Serve static files  │
│  • WebSocket handler   │
│  • SQLite persistence │
└───────┬───────────────┘
        │
        ▼
┌───────────────────────┐
│      SQLite DB         │
│  (decks, games, users) │
└───────────────────────┘
```

> *A diagram illustrating the client‑server interaction can be found in `docs/architecture.png`.*

---

## 4. Quick Start

### Prerequisites

- **Python 3.12** (recommended)
- `pip` (Python package manager)

> The front‑end requires no additional dependencies; all logic runs in the browser.

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/card-game-js.git
cd card-game-js

# 2. (Optional) Create a virtual environment
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate

# 3. Install server dependencies
pip install -r requirements.txt
```

### Execution

```bash
# Start the development server
python server.py
```

Open your browser and navigate to `http://localhost:8000`.  
You should see the game lobby. Click **Play** to start a new game or **Load Deck** to import a deck JSON.

> For a production build, run `python server.py --prod` and serve the static files via a reverse proxy (e.g., Nginx).

---

## 5. Project Structure

```
card-game-js/
├── docs/
│   └── architecture.png          # Visual architecture diagram
├── static/
│   ├── css/
│   │   └── style.css             # UI styling
│   ├── js/
│   │   ├── game.js               # Core game logic
│   │   ├── ui.js                 # UI helpers
│   │   └── websocket.js          # WebSocket communication
│   └── index.html                # Entry point
├── server/
│   ├── __init__.py
│   ├── routes.py                 # HTTP endpoints
│   ├── websocket_handler.py      # WebSocket logic
│   └── models.py                 # ORM models (SQLite)
├── tests/
│   ├── test_game_logic.py        # Unit tests for game engine
│   └── test_server.py            # Integration tests
├── requirements.txt              # Python dependencies
├── server.py                     # Entry point for the Python server
├── README.md
└── LICENSE
```

- **`static/`** – contains all front‑end assets.  
- **`server/`** – Python modules handling HTTP routes, WebSocket connections, and database models.  
- **`tests/`** – automated tests ensuring game logic correctness and server reliability.  
- **`docs/`** – documentation assets, including the architecture diagram.  

Feel free to extend the project by adding new card types, AI opponents, or a REST API for deck management. All changes should follow the existing modular pattern to keep the codebase maintainable.

---

## License

MIT © 2026 Your Name

---