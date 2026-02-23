import { Game } from './game.js';
import { Deck } from './deck.js';
import { Player } from './player.js';
import { Card } from './card.js';

function initGame() {
    // Create a new game instance
    const game = new Game();
    
    // Set up UI containers (assuming these elements exist in the DOM)
    const gameContainer = document.getElementById('game-container');
    const playerArea = document.getElementById('player-area');
    const opponentArea = document.getElementById('opponent-area');
    const handArea = document.getElementById('hand-area');
    const deckArea = document.getElementById('deck-area');
    const manaArea = document.getElementById('mana-area');
    
    // Initialize game state
    game.initialize();
    
    // Attach event listeners for card actions
    if (handArea) {
        handArea.addEventListener('click', (event) => {
            const cardElement = event.target.closest('.card');
            if (cardElement) {
                const cardIndex = Array.from(handArea.children).indexOf(cardElement);
                if (cardIndex !== -1) {
                    game.playCard(cardIndex);
                }
            }
        });
    }
    
    // Set up drag and drop for cards (if needed)
    if (handArea) {
        handArea.addEventListener('dragstart', (event) => {
            if (event.target.classList.contains('card')) {
                event.dataTransfer.setData('text/plain', event.target.dataset.cardIndex);
            }
        });
    }
    
    // Render initial game state
    renderGameState(game);
}

function renderGameState(game) {
    const player = game.player;
    const opponent = game.opponent;
    const handArea = document.getElementById('hand-area');
    const manaArea = document.getElementById('mana-area');
    
    if (handArea && player && player.hand) {
        handArea.innerHTML = '';
        player.hand.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.dataset.cardIndex = index;
            cardElement.draggable = true;
            
            cardElement.innerHTML = `
                <div class="card-header">
                    <h3 class="card-name">${card.name}</h3>
                    <span class="card-cost">${card.cost}</span>
                </div>
                <div class="card-body">
                    <p class="card-type">${card.type}</p>
                    <p class="card-attack">${card.attack}</p>
                    <p class="card-defense">${card.defense}</p>
                </div>
            `;
            
            handArea.appendChild(cardElement);
        });
    }
    
    if (manaArea && player) {
        manaArea.innerHTML = `<span>Mana: ${player.mana}</span>`;
    }
}

function connectWebSocket() {
    // Establish WebSocket connection to backend
    const ws = new WebSocket('ws://localhost:8000/ws');
    
    ws.onopen = function(event) {
        console.log('WebSocket connection established');
        // Send initial game state or authentication
    };
    
    ws.onmessage = function(event) {
        const message = JSON.parse(event.data);
        console.log('Received message:', message);
        
        // Handle incoming messages (game state updates, actions, etc.)
        switch (message.type) {
            case 'game_state':
                // Update local game state
                break;
            case 'player_action':
                // Process player action
                break;
            default:
                console.log('Unknown message type:', message.type);
        }
    };
    
    ws.onclose = function(event) {
        console.log('WebSocket connection closed');
    };
    
    ws.onerror = function(error) {
        console.error('WebSocket error:', error);
    };
    
    // Forward user actions to the backend
    window.addEventListener('gameAction', function(event) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(event.detail));
        }
    });
}

// Export functions for use by HTML entry point
export { initGame, connectWebSocket };

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    connectWebSocket();
});