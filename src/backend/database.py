import sqlite3
import json
import os

class Database:
    def __init__(self, db_path):
        self.db_path = db_path
        self.conn = None
        self._init_db()
    
    def _init_db(self):
        # Create the database file if it doesn't exist
        if not os.path.exists(self.db_path):
            os.makedirs(os.path.dirname(self.db_path) if os.path.dirname(self.db_path) else '.', exist_ok=True)
        
        self.conn = sqlite3.connect(self.db_path)
        self.conn.row_factory = sqlite3.Row  # This allows us to access columns by name
        
        # Create tables
        with self.conn:
            self.conn.execute('''
                CREATE TABLE IF NOT EXISTS players (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    avatar TEXT
                )
            ''')
            
            self.conn.execute('''
                CREATE TABLE IF NOT EXISTS decks (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    player_id INTEGER NOT NULL,
                    name TEXT NOT NULL,
                    FOREIGN KEY (player_id) REFERENCES players (id)
                )
            ''')
            
            self.conn.execute('''
                CREATE TABLE IF NOT EXISTS cards (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    deck_id INTEGER NOT NULL,
                    name TEXT NOT NULL,
                    type TEXT NOT NULL,
                    mana_cost INTEGER NOT NULL,
                    attack INTEGER,
                    defense INTEGER,
                    FOREIGN KEY (deck_id) REFERENCES decks (id)
                )
            ''')
            
            self.conn.execute('''
                CREATE TABLE IF NOT EXISTS game_state (
                    id INTEGER PRIMARY KEY DEFAULT 1,
                    state_json TEXT NOT NULL
                )
            ''')
    
    def add_player(self, username, avatar):
        try:
            with self.conn:
                cursor = self.conn.execute(
                    'INSERT INTO players (username, avatar) VALUES (?, ?)',
                    (username, avatar)
                )
                return cursor.lastrowid
        except sqlite3.IntegrityError:
            raise ValueError(f"Player with username '{username}' already exists")
    
    def get_player(self, player_id):
        cursor = self.conn.execute('SELECT * FROM players WHERE id = ?', (player_id,))
        return cursor.fetchone()
    
    def add_deck(self, player_id, name):
        try:
            with self.conn:
                cursor = self.conn.execute(
                    'INSERT INTO decks (player_id, name) VALUES (?, ?)',
                    (player_id, name)
                )
                return cursor.lastrowid
        except sqlite3.IntegrityError:
            raise ValueError(f"Failed to add deck for player {player_id}")
    
    def add_card(self, deck_id, name, type, mana_cost, attack, defense):
        try:
            with self.conn:
                self.conn.execute(
                    'INSERT INTO cards (deck_id, name, type, mana_cost, attack, defense) VALUES (?, ?, ?, ?, ?, ?)',
                    (deck_id, name, type, mana_cost, attack, defense)
                )
        except sqlite3.IntegrityError:
            raise ValueError(f"Failed to add card to deck {deck_id}")
    
    def get_deck(self, deck_id):
        # Get deck metadata
        deck_cursor = self.conn.execute('SELECT * FROM decks WHERE id = ?', (deck_id,))
        deck = deck_cursor.fetchone()
        if not deck:
            return None
        
        # Get associated cards
        cards_cursor = self.conn.execute('SELECT * FROM cards WHERE deck_id = ?', (deck_id,))
        cards = cards_cursor.fetchall()
        
        return {
            'deck': dict(deck),
            'cards': [dict(card) for card in cards]
        }
    
    def save_game_state(self, state_dict):
        try:
            with self.conn:
                state_json = json.dumps(state_dict)
                # Check if a game state already exists
                cursor = self.conn.execute('SELECT id FROM game_state')
                existing = cursor.fetchone()
                
                if existing:
                    self.conn.execute(
                        'UPDATE game_state SET state_json = ? WHERE id = 1',
                        (state_json,)
                    )
                else:
                    self.conn.execute(
                        'INSERT INTO game_state (state_json) VALUES (?)',
                        (state_json,)
                    )
        except Exception as e:
            raise RuntimeError(f"Failed to save game state: {str(e)}")
    
    def load_game_state(self):
        try:
            cursor = self.conn.execute('SELECT state_json FROM game_state WHERE id = 1')
            row = cursor.fetchone()
            if row:
                return json.loads(row['state_json'])
            return None
        except Exception as e:
            raise RuntimeError(f"Failed to load game state: {str(e)}")
    
    def close(self):
        if self.conn:
            self.conn.close()