export class Game {
    constructor() {
        this.players = [new Player("Player 1"), new Player("Player 2")];
        this.currentTurn = 0;
        this.battlefield = [];
        this.manaPool = 0;
        this.ws = null;
        this.playerId = null;
        this.gameState = {
            players: [],
            currentTurn: 0,
            battlefield: [],
            manaPool: 0
        };
    }

    // Initialize WebSocket connection
    initWebSocket(url) {
        this.ws = new WebSocket(url);
        
        this.ws.onopen = () => {
            console.log("Connected to game server");
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleGameStateUpdate(data);
        };

        this.ws.onclose = () => {
            console.log("Disconnected from game server");
        };

        this.ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    }

    // Send game state to other player
    sendGameState() {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            const gameState = {
                players: this.players.map(player => ({
                    name: player.name,
                    life: player.life,
                    mana: player.mana,
                    hand: player.hand.map(card => ({
                        name: card.name,
                        cost: card.cost,
                        attack: card.attack,
                        defense: card.defense,
                        type: card.type,
                        abilities: card.abilities
                    }))
                })),
                currentTurn: this.currentTurn,
                battlefield: this.battlefield.map(card => ({
                    name: card.name,
                    cost: card.cost,
                    attack: card.attack,
                    defense: card.defense,
                    type: card.type,
                    abilities: card.abilities
                })),
                manaPool: this.manaPool
            };
            
            this.ws.send(JSON.stringify({
                type: 'gameState',
                data: gameState
            }));
        }
    }

    // Handle incoming game state from other player
    handleGameStateUpdate(data) {
        if (data.type === 'gameState') {
            const gameState = data.data;
            
            // Update local game state
            this.currentTurn = gameState.currentTurn;
            this.manaPool = gameState.manaPool;
            
            // Update players
            this.players.forEach((player, index) => {
                if (gameState.players[index]) {
                    player._life = gameState.players[index].life;
                    player._mana = gameState.players[index].mana;
                    player._hand = gameState.players[index].hand.map(cardData => 
                        new Card(cardData)
                    );
                }
            });
            
            // Update battlefield
            this.battlefield = gameState.battlefield.map(cardData => 
                new Card(cardData)
            );
            
            // Trigger UI updates
            this.onGameStateUpdate();
        }
    }

    // Resolve conflicts when both players act
    resolveConflict(action1, action2) {
        // Simple conflict resolution: last action wins
        // In a real implementation, this could be more sophisticated
        // For example, using timestamps or action ordering
        if (action1.timestamp > action2.timestamp) {
            return action1;
        } else if (action2.timestamp > action1.timestamp) {
            return action2;
        } else {
            // If timestamps are equal, resolve based on player ID
            return action1.playerId < action2.playerId ? action1 : action2;
        }
    }

    // Start a new turn
    startTurn() {
        const player = this.players[this.currentTurn];
        player.gainMana(1);
        this.manaPool = player.mana;
        
        // Send updated state to other player
        this.sendGameState();
        
        // Trigger UI update
        this.onTurnChange();
    }

    // End current turn
    endTurn() {
        this.currentTurn = (this.currentTurn + 1) % 2;
        this.manaPool = 0;
        
        // Send updated state to other player
        this.sendGameState();
        
        // Trigger UI update
        this.onTurnChange();
    }

    // Play a card
    playCard(cardIndex, target = null) {
        const player = this.players[this.currentTurn];
        const card = player.playCard(cardIndex);
        
        if (card) {
            this.battlefield.push(card);
            
            // Apply card abilities if any
            if (card.abilities && card.abilities.length > 0) {
                this.applyCardAbilities(card, target);
            }
            
            // Send updated state to other player
            this.sendGameState();
            
            // Trigger UI update
            this.onCardPlayed(card);
        }
    }

    // Apply card abilities
    applyCardAbilities(card, target) {
        // This would contain logic for applying specific card abilities
        // For now, just a placeholder
        card.abilities.forEach(ability => {
            // Apply ability logic here
        });
    }

    // Resolve combat
    resolveCombat() {
        // Simple combat resolution logic
        // In a real implementation, this would be more complex
        this.battlefield.forEach(card => {
            if (card.attack > 0) {
                // Apply damage to opponent
                const opponent = this.players[(this.currentTurn + 1) % 2];
                opponent.loseLife(card.attack);
            }
        });
        
        // Remove destroyed cards
        this.battlefield = this.battlefield.filter(card => card.defense > 0);
        
        // Send updated state to other player
        this.sendGameState();
    }

    // Event hooks for UI updates
    onTurnChange() {
        // Trigger UI update for turn change
        if (typeof this.onTurnChangeCallback === 'function') {
            this.onTurnChangeCallback();
        }
    }

    onCardPlayed(card) {
        // Trigger UI update for card played
        if (typeof this.onCardPlayedCallback === 'function') {
            this.onCardPlayedCallback(card);
        }
    }

    onGameStateUpdate() {
        // Trigger UI update for game state changes
        if (typeof this.onGameStateUpdateCallback === 'function') {
            this.onGameStateUpdateCallback();
        }
    }

    // Set event callbacks
    setOnTurnChange(callback) {
        this.onTurnChangeCallback = callback;
    }

    setOnCardPlayed(callback) {
        this.onCardPlayedCallback = callback;
    }

    setOnGameStateUpdate(callback) {
        this.onGameStateUpdateCallback = callback;
    }
}