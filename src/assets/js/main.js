import { Game, Deck, Player, Card } from './game.js';

function renderCard(card, container) {
    if (!container) {
        console.error('Container element is null or undefined');
        return;
    }

    if (!card) {
        console.error('Card object is null or undefined');
        return;
    }

    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.draggable = true;
    
    // Create card HTML using card properties
    cardElement.innerHTML = `
        <div class="card-header">
            <h3 class="card-name">${card.name}</h3>
            <span class="card-cost">${card.cost}</span>
        </div>
        <div class="card-type">${card.type}</div>
        <div class="card-abilities">${card.abilities.join(', ')}</div>
        <div class="card-stats">
            <span class="card-attack">${card.attack}</span>
            <span class="card-defense">${card.defense}</span>
        </div>
    `;
    
    container.appendChild(cardElement);
}

function updateUI(gameState) {
    // Update player info
    const playerInfo = document.getElementById('player-info');
    if (playerInfo && gameState.player) {
        playerInfo.innerHTML = `
            <h2>${gameState.player.name}</h2>
            <p>Life: ${gameState.player.life}</p>
            <p>Mana: ${gameState.player.mana}</p>
        `;
    }

    // Update hand
    const handContainer = document.getElementById('hand');
    if (handContainer) {
        handContainer.innerHTML = '';
        if (gameState.player && gameState.player.hand) {
            gameState.player.hand.forEach((card, index) => {
                const cardElement = document.createElement('div');
                cardElement.className = 'card';
                cardElement.draggable = true;
                cardElement.dataset.index = index;
                
                cardElement.innerHTML = `
                    <div class="card-header">
                        <h3 class="card-name">${card.name}</h3>
                        <span class="card-cost">${card.cost}</span>
                    </div>
                    <div class="card-type">${card.type}</div>
                    <div class="card-abilities">${card.abilities.join(', ')}</div>
                    <div class="card-stats">
                        <span class="card-attack">${card.attack}</span>
                        <span class="card-defense">${card.defense}</span>
                    </div>
                `;
                
                handContainer.appendChild(cardElement);
            });
        }
    }

    // Update deck info
    const deckInfo = document.getElementById('deck-info');
    if (deckInfo && gameState.player) {
        deckInfo.innerHTML = `
            <p>Deck size: ${gameState.player.deck.size()}</p>
            <p>Hand size: ${gameState.player.hand.length}</p>
        `;
    }
}

function initGame() {
    // Initialize game UI elements
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) {
        console.error('Game container not found');
        return;
    }

    // Create basic UI structure if it doesn't exist
    if (!document.getElementById('player-info')) {
        const playerInfo = document.createElement('div');
        playerInfo.id = 'player-info';
        gameContainer.appendChild(playerInfo);
    }

    if (!document.getElementById('hand')) {
        const handContainer = document.createElement('div');
        handContainer.id = 'hand';
        handContainer.className = 'hand';
        gameContainer.appendChild(handContainer);
    }

    if (!document.getElementById('deck-info')) {
        const deckInfo = document.createElement('div');
        deckInfo.id = 'deck-info';
        gameContainer.appendChild(deckInfo);
    }

    // Add event listeners for card actions
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('card')) {
            const cardIndex = event.target.dataset.index;
            if (cardIndex !== undefined) {
                // Send play card action to backend
                if (ws && ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({
                        action: 'play_card',
                        card_index: parseInt(cardIndex)
                    }));
                }
            }
        }
    });

    // Add drag and drop functionality
    document.addEventListener('dragstart', (event) => {
        if (event.target.classList.contains('card')) {
            event.dataTransfer.setData('text/plain', event.target.dataset.index);
        }
    });

    document.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    document.addEventListener('drop', (event) => {
        event.preventDefault();
        const cardIndex = event.dataTransfer.getData('text/plain');
        if (cardIndex !== '') {
            // Send play card action to backend
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    action: 'play_card',
                    card_index: parseInt(cardIndex)
                }));
            }
        }
    });
}

let ws;

function connectWebSocket() {
    // Create WebSocket connection to the backend
    const socketUrl = `ws://${window.location.host}/ws`;
    ws = new WebSocket(socketUrl);
    
    ws.onopen = function(event) {
        console.log('WebSocket connection established');
        // Request initial game state
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ action: 'get_state' }));
        }
    };

    ws.onmessage = function(event) {
        try {
            const message = JSON.parse(event.data);
            console.log('Received message:', message);
            
            if (message.type === 'game_state') {
                updateUI(message.data);
            } else if (message.type === 'error') {
                console.error('Server error:', message.data);
            } else if (message.type === 'action_response') {
                console.log('Action response:', message.data);
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    };

    ws.onclose = function(event) {
        console.log('WebSocket connection closed');
        // Attempt to reconnect after a delay
        setTimeout(connectWebSocket, 3000);
    };

    ws.onerror = function(error) {
        console.error('WebSocket error:', error);
    };
}

// Export functions for use by HTML entry point
export { initGame, connectWebSocket };