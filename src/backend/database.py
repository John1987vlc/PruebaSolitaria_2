import sqlite3
import json
import os

class Database:
    def __init__(self, db_path):
        self.db_path = db_path
        self.conn = None
        self._init_db()
    
    def _init_db(self):
        # Create database file if it doesn't exist
        if not os.path.exists(self.db_path):
            os.makedirs(os.path.dirname(self.db_path) if os.path.dirname(self.db_path) else '.', exist_ok=True)
        
        self.conn = sqlite3.connect(self.db_path)
        self.conn.execute("PRAGMA foreign_keys = ON")
        
        # Create tables
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
                FOREIGN KEY (player_id) REFERENCES players (id) ON DELETE CASCADE
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
                FOREIGN KEY (deck_id) REFERENCES decks (id) ON DELETE CASCADE
            )
        ''')
        
        self.conn.execute('''
            CREATE TABLE IF NOT EXISTS game_state (
                id INTEGER PRIMARY KEY DEFAULT 1,
                state_json TEXT NOT NULL
            )
        ''')
        
        # Ensure there's always one row in game_state table
        self.conn.execute('''
            INSERT OR IGNORE INTO game_state (id, state_json) VALUES (1, '{}')
        ''')
        
        self.conn.commit()
    
    def add_player(self, username, avatar):
        try:
            cursor = self.conn.cursor()
            cursor.execute("INSERT INTO players (username, avatar) VALUES (?, ?)", (username, avatar))
            self.conn.commit()
            return cursor.lastrowid
        except sqlite3.IntegrityError:
            self.conn.rollback()
            raise ValueError("Username already exists")
    
    def get_player(self, player_id):
        cursor = self.conn.cursor()
        cursor.execute("SELECT id, username, avatar FROM players WHERE id = ?", (player_id,))
        result = cursor.fetchone()
        if result:
            return {
                'id': result[0],
                'username': result[1],
                'avatar': result[2]
            }
        return None
    
    def add_deck(self, player_id, name):
        try:
            cursor = self.conn.cursor()
            cursor.execute("INSERT INTO decks (player_id, name) VALUES (?, ?)", (player_id, name))
            self.conn.commit()
            return cursor.lastrowid
        except sqlite3.IntegrityError:
            self.conn.rollback()
            raise ValueError("Failed to add deck")
    
    def add_card(self, deck_id, name, type, mana_cost, attack, defense):
        try:
            cursor = self.conn.cursor()
            cursor.execute("INSERT INTO cards (deck_id, name, type, mana_cost, attack, defense) VALUES (?, ?, ?, ?, ?, ?)",
                          (deck_id, name, type, mana_cost, attack, defense))
            self.conn.commit()
            return cursor.lastrowid
        except sqlite3.IntegrityError:
            self.conn.rollback()
            raise ValueError("Failed to add card")
    
    def get_deck(self, deck_id):
        cursor = self.conn.cursor()
        
        # Get deck metadata
        cursor.execute("SELECT id, player_id, name FROM decks WHERE id = ?", (deck_id,))
        deck_result = cursor.fetchone()
        if not deck_result:
            return None
            
        deck = {
            'id': deck_result[0],
            'player_id': deck_result[1],
            'name': deck_result[2],
            'cards': []
        }
        
        # Get cards in the deck
        cursor.execute("SELECT id, name, type, mana_cost, attack, defense FROM cards WHERE deck_id = ?", (deck_id,))
        cards_result = cursor.fetchall()
        
        for card in cards_result:
            deck['cards'].append({
                'id': card[0],
                'name': card[1],
                'type': card[2],
                'mana_cost': card[3],
                'attack': card[4],
                'defense': card[5]
            })
        
        return deck
    
    def save_game_state(self, state_dict):
        try:
            state_json = json.dumps(state_dict)
            cursor = self.conn.cursor()
            cursor.execute("UPDATE game_state SET state_json = ? WHERE id = 1", (state_json,))
            self.conn.commit()
        except Exception:
            self.conn.rollback()
            raise
    
    def load_game_state(self):
        try:
            cursor = self.conn.cursor()
            cursor.execute("SELECT state_json FROM game_state WHERE id = 1")
            result = cursor.fetchone()
            if result and result[0]:
                return json.loads(result[0])
            return {}
        except Exception:
            return {}
    
    def close(self):
        if self.conn:
            self.conn.close()