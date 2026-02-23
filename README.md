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

## 3. Installation

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3.12 or higher

### Setup Instructions
1. Clone the repository:
      git clone https://github.com/your-username/Card-Game-JS.git
   cd Card-Game-JS
   
2. Install Python dependencies:
      pip install -r requirements.txt
   
3. Start the server:
      python src/main.py
   
4. Open your browser and navigate to `http://localhost:8000`

---

## 4. Usage

### Launching the Game
1. Run the server using `python src/main.py`
2. Open your browser and go to `http://localhost:8000`
3. Create a new player account or log in

### Game Interface
- **Deck Builder**: Create and manage your card decks
- **Game Board**: Play cards, manage mana, and engage in combat
- **Player Stats**: View your current mana, life points, and hand
- **Multiplayer**: Join or create matches with other players

### Basic Gameplay
1. Draw a card each turn
2. Spend mana to play cards from your hand
3. Attack opponents or block their attacks
4. Manage your mana pool and life points
5. Win by reducing your opponent's life points to zero

---

## 5. Architecture

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
│   SQLite Database      │
│  (game_state.db)       │
└──────────┬─────────────┘

### Client-Side
- `index.html`: Main game interface
- `styles.css`: Game styling and responsive layout
- `game.js`: Core game logic and state management
- `deck.js`: Deck building and management
- `player.js`: Player data and actions
- `card.js`: Card definitions and behaviors

### Server-Side
- `server.py`: Main FastAPI server with WebSocket support
- `websocket.py`: Real-time communication handlers
- `database.py`: SQLite database operations for game state and player data

---

## 6. Contributing

We welcome contributions to improve Card-Game-JS! Here's how you can help:

### Coding Standards
- Follow JavaScript ES6+ conventions
- Use consistent naming conventions
- Write clear, descriptive comments
- Maintain clean, readable code

### Running Tests
# Run unit tests
python -m pytest tests/

# Run linters
flake8 src/

### Pull Request Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

---

## 7. License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.