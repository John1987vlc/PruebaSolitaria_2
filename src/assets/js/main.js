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
        <div class="card-stats">
            <span class="card-attack">${card.attack}</span>
            <span class="card-defense">${card.defense}</span>
        </div>
        <div class="card-abilities">
            ${card.abilities.map(ability => `<span class="ability">${ability}</span>`).join('')}
        </div>
    `;

    // Add drag start event
    cardElement.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', card.name);
        e.dataTransfer.effectAllowed = 'move';
    });

    container.appendChild(cardElement);
}

function initGame() {
    // Get DOM elements
    const deckContainer = document.getElementById('deck-container');
    const cardPool = document.getElementById('card-pool');
    
    // Check if elements exist
    if (!deckContainer || !cardPool) {
        console.error('Required DOM elements not found');
        return;
    }

    // Create a sample deck and player for testing
    const player = new Player('Player 1');
    const deck = new Deck();
    
    // Sample cards for the pool
    const sampleCards = [
        new Card({ name: 'Goblin', cost: 1, attack: 2, defense: 1, type: 'Creature', abilities: [] }),
        new Card({ name: 'Knight', cost: 2, attack: 3, defense: 2, type: 'Creature', abilities: [] }),
        new Card({ name: 'Spell', cost: 3, attack: 0, defense: 0, type: 'Spell', abilities: [] }),
        new Card({ name: 'Dragon', cost: 4, attack: 5, defense: 4, type: 'Creature', abilities: [] })
    ];

    // Render cards in the pool
    sampleCards.forEach(card => {
        renderCard(card, cardPool);
    });

    // Set up drag and drop for deck container
    deckContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    });

    deckContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        
        // Get the card name from drag data
        const cardName = e.dataTransfer.getData('text/plain');
        
        // Check if we're under deck size limit (assuming 30 cards max)
        if (deck.size() >= 30) {
            alert('Deck is full! Maximum 30 cards allowed.');
            return;
        }
        
        // Find the card in our sample cards
        const card = sampleCards.find(c => c.name === cardName);
        if (card) {
            deck.addCard(card);
            renderCard(card, deckContainer);
        }
    });
}

function connectWebSocket() {
    // Establish WebSocket connection to backend
    const ws = new WebSocket('ws://localhost:8080/ws');
    
    ws.onopen = function(event) {
        console.log('WebSocket connection established');
    };
    
    ws.onmessage = function(event) {
        // Handle incoming messages from the backend
        const message = JSON.parse(event.data);
        console.log('Received message:', message);
        
        // Forward user actions to backend
        // This would typically involve sending game state updates
    };
    
    ws.onerror = function(error) {
        console.error('WebSocket error:', error);
    };
    
    ws.onclose = function() {
        console.log('WebSocket connection closed');
    };
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    connectWebSocket();
});

// Export functions for use by HTML entry point
export { initGame, connectWebSocket };