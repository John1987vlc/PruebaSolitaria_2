from flask_socketio import SocketIO, emit, join_room, leave_room
import json

class WebSocketHandler:
    def __init__(self, game_server):
        self.game_server = game_server
        self.socketio = SocketIO()
        
    def connect(self, sid, environ):
        """Handle new WebSocket connections"""
        try:
            # Register player with GameServer
            player_id = self.game_server.register_player(sid)
            
            # Send initial game state
            initial_state = self.game_server.get_game_state(player_id)
            emit('game_state', initial_state, room=sid)
            
        except Exception as e:
            print(f"Connection error: {e}")
            emit('error', {'message': 'Failed to connect'})
    
    def message(self, sid, data):
        """Handle incoming messages"""
        try:
            # Parse JSON message
            message_data = json.loads(data)
            
            # Forward action to GameServer
            result = self.game_server.handle_action(sid, message_data)
            
            # Broadcast updates to relevant rooms
            if result:
                self.socketio.emit('update', result, room=message_data.get('room', sid))
                
        except json.JSONDecodeError:
            emit('error', {'message': 'Malformed message'})
        except Exception as e:
            print(f"Message handling error: {e}")
            emit('error', {'message': 'Failed to process message'})
    
    def disconnect(self, sid):
        """Handle WebSocket disconnections"""
        try:
            # Notify GameServer of disconnection
            self.game_server.unregister_player(sid)
            
            # Clean up resources if needed
            # (e.g., remove from rooms, cleanup state)
            
        except Exception as e:
            print(f"Disconnection error: {e}")