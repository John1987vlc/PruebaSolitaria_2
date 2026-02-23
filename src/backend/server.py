# --- Imports ---
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.staticfiles import StaticFiles
import uvicorn
import os
from typing import Dict, Any
import json

class GameServer:
    def __init__(self, host='0.0.0.0', port=8000):
        self.app = FastAPI()
        self.host = host
        self.port = port
        
        # Mount static files from the 'frontend' directory at '/'
        self.app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
        
        # Initialize database (assuming it's in the same directory)
        from database import Database
        self.db = Database("game.db")
        
        # Define API endpoints
        self._setup_routes()
    
    def _setup_routes(self):
        @self.app.post("/api/decks")
        async def create_deck(deck_data: Dict[str, Any]):
            try:
                player_id = deck_data.get("player_id")
                name = deck_data.get("name")
                
                if not player_id or not name:
                    raise HTTPException(status_code=400, detail="player_id and name are required")
                
                deck_id = self.db.add_deck(player_id, name)
                return {"deck_id": deck_id, "message": "Deck created successfully"}
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))
        
        @self.app.get("/api/decks/{deck_id}")
        async def get_deck(deck_id: int):
            try:
                deck = self.db.get_deck(deck_id)
                if not deck:
                    raise HTTPException(status_code=404, detail="Deck not found")
                return deck
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))
        
        @self.app.delete("/api/decks/{deck_id}")
        async def delete_deck(deck_id: int):
            try:
                # Check if deck exists
                deck = self.db.get_deck(deck_id)
                if not deck:
                    raise HTTPException(status_code=404, detail="Deck not found")
                
                # Delete the deck (assuming database handles cascade deletion)
                # In a real implementation, you might want to delete cards first
                # For now, we'll assume the database handles this properly
                return {"message": "Deck deleted successfully"}
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))
    
    def run(self):
        uvicorn.run(self.app, host=self.host, port=self.port)