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
    
    // Set up event listeners for card clicks
    handArea.addEventListener('click', (event) => {
        const cardElement = event.target.closest('.card');
        if (cardElement) {
            const cardIndex = parseInt(cardElement.dataset.index);
            if (!isNaN(cardIndex)) {
                // Check if player can play this card (has enough mana)
                const player = game.getCurrentPlayer();
                const card = player.getHand()[cardIndex];
                
                if (player.getMana() >= card.cost) {
                    // Play the card
                    game.playCard(cardIndex);
                    // Update UI
                    updateGameUI(game);
                } else {
                    // Not enough mana
                    console.log('Not enough mana to play this card');
                }
            }
        }
    });
}

function updateGameUI(game) {
    // This function would update the UI based on the game state
    // Implementation would depend on the specific DOM structure
    const player = game.getCurrentPlayer();
    const manaArea = document.getElementById('mana-area');
    const handArea = document.getElementById('hand-area');
    
    if (manaArea) {
        manaArea.textContent = `Mana: ${player.getMana()}`;
    }
    
    // Clear and re-render hand
    if (handArea) {
        handArea.innerHTML = '';
        player.getHand().forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.dataset.index = index;
            cardElement.innerHTML = `
                <div class="card-name">${card.name}</div>
                <div class="card-cost">Cost: ${card.cost}</div>
                <div class="card-attack">Attack: ${card.attack}</div>
                <div class="card-defense">Defense: ${card.defense}</div>
            `;
            handArea.appendChild(cardElement);
        });
    }
}

function connectWebSocket() {
    // Establish WebSocket connection to backend
    const ws = new WebSocket('ws://localhost:8000/ws');
    
    ws.onopen = function(event) {
        console.log('Connected to WebSocket server');
    };
    
    ws.onmessage = function(event) {
        // Handle incoming messages
        const message = JSON.parse(event.data);
        console.log('Received message:', message);
        
        // Forward user actions to backend
        // This would depend on the specific message types expected
    };
    
    ws.onclose = function(event) {
        console.log('Disconnected from WebSocket server');
    };
    
    ws.onerror = function(error) {
        console.error('WebSocket error:', error);
    };
    
    return ws;
}

// Export functions for use by HTML entry point
export { initGame, connectWebSocket };