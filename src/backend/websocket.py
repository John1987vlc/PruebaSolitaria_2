# --- Imports ---
from flask_socketio import SocketIO, emit, join_room, leave_room
import json

class WebSocketHandler:
    def __init__(self, game_server):
        self.game_server = game_server
        self.sid_to_player = {}
        
    def connect(self, sid, environ):
        # When a client connects, register them with the game server
        # For now, we'll just store the sid mapping
        pass
        
    def message(self, sid, data):
        try:
            # Parse the JSON message
            message = json.loads(data)
            
            # Forward the action to the game server
            result = self.game_server.handle_action(message)
            
            # Broadcast the updated game state to all connected clients
            emit('game_state_update', result, broadcast=True)
            
        except json.JSONDecodeError:
            # Handle malformed JSON
            emit('error', {'message': 'Invalid JSON message'})
        except Exception as e:
            # Handle any other errors
            emit('error', {'message': str(e)})
            
    def disconnect(self, sid):
        # When a client disconnects, remove them from the game server
        if sid in self.sid_to_player:
            player_id = self.sid_to_player[sid]
            self.game_server.remove_player(player_id)
            del self.sid_to_player[sid]