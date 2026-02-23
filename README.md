# Card Battle – A Text‑Based Magic‑the‑Gathering Clone  
**MIT License** | **Python 3.12** | **HTML 5 / CSS 3 / JavaScript ES2024**

---

## 1. Project Overview & Value Proposition  

Card Battle is a lightweight, browser‑based card game that captures the core mechanics of collectible card games like *Magic: The Gathering*—deck building, mana management, and turn‑based combat—without relying on images or external assets.  

- **Zero‑dependency**: Pure HTML, CSS, and vanilla JavaScript; no build tools or asset pipelines.  
- **Fast iteration**: Edit the `cards.json` file to add or tweak cards; the game updates instantly.  
- **Educational**: Ideal for teaching game design, data structures, and web development fundamentals.  
- **Cross‑platform**: Runs in any modern browser; no installation required for end‑users.  

---

## 2. Key Features  

- **Dynamic Deck Builder** – Create and shuffle custom decks from a shared card pool.  
- **Mana System** – Each turn regenerates mana; cards consume mana to be played.  
- **Combat Engine** – Resolve attacks, damage, and deathrattle effects with deterministic logic.  
- **Card Types & Abilities** – Creatures, spells, and artifacts with scripted effects.  
- **Turn‑Based Flow** – Phases: Draw, Main, Combat, End.  
- **Stateless Server** – Served as static files; no backend required for gameplay.  
- **Responsive UI** – Works on desktop, tablet, and mobile browsers.  
- **Accessibility** – Keyboard navigation and ARIA labels for inclusive play.  

---

## 3. Visual / Architecture Overview  

```
┌───────────────────────┐
│   Browser (HTML/CSS/JS)│
│  ┌─────────────────────┐
│  │  UI Layer (React‑like │
│  │   vanilla components) │
│  └─────────────────────┘
│  ┌─────────────────────┐
│  │  Game Engine (JS)   │
│  │  • Deck & Hand      │
│  │  • Mana Management │
│  │  • Combat Resolver │
│  └─────────────────────┘
│  ┌─────────────────────┐
│  │  Data Store (JSON)  │
│  │  • cards.json       │
│  │  • decks.json       │
│  └─────────────────────┘
└───────────────────────┘
```

> **Note**: The diagram above is a placeholder. In the full project repository, a detailed UML diagram is available in the `docs/architecture.png` file.

---

## 4. Quick Start  

### Prerequisites  

- **Python 3.12** (standard library only)  
- A modern web browser (Chrome, Firefox, Edge, Safari)

### Installation  

```bash
# Clone the repository
git clone https://github.com/your-username/card-battle.git
cd card-battle
```

> No npm, yarn, or bundlers are required.

### Execution  

```bash
# Start a simple HTTP server (Python 3.12)
python -m http.server 8000
```

Open your browser and navigate to `http://localhost:8000`.  
The game loads automatically; no additional configuration is needed.

---

## 5. Project Structure  

```
card-battle/
├── assets/                # Optional: CSS reset, fonts, icons
├── docs/                  # Documentation, diagrams, screenshots
├── src/
│   ├── cards.json         # Master card database
│   ├── decks.json         # Predefined decks (optional)
│   ├── index.html         # Main entry point
│   ├── style.css          # UI styling
│   └── game.js            # Core game logic
├── LICENSE                # MIT License
├── README.md              # This file
└── .gitignore
```

- **`cards.json`** – Each card entry includes `id`, `name`, `type`, `manaCost`, `attack`, `health`, and optional `abilities`.  
- **`decks.json`** – Example decks for quick testing.  
- **`game.js`** – Implements the game engine, event handling, and UI rendering.  
- **`style.css`** – Responsive layout, card styling, and theme variables.  

---

### Extending the Game  

1. **Add a new card** – Append a JSON object to `cards.json`.  
2. **Create a deck** – Add a deck array to `decks.json`.  
3. **Define abilities** – Implement new ability functions in `game.js` and reference them by name in the card data.  

---

Happy hacking!  
Feel free to open issues or submit pull requests to improve gameplay, add new card types, or enhance the UI.