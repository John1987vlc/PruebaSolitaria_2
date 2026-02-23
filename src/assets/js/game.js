export class Game {
    constructor() {
        this.players = [new Player("Player 1"), new Player("Player 2")];
        this.currentTurn = 0;
        this.battlefield = [];
        this.manaPool = { player1: 0, player2: 0 };
        
        // Initialize the game
        this.players[0].deck.shuffle();
        this.players[1].deck.shuffle();
        
        // Draw opening hands
        for (let i = 0; i < 7; i++) {
            this.players[0].drawCard();
            this.players[1].drawCard();
        }
    }

    startTurn() {
        const currentPlayer = this.players[this.currentTurn];
        currentPlayer.gainMana(1); // Grant one mana per turn
        this.manaPool[`player${this.currentTurn + 1}`] = currentPlayer.mana;
        
        // Trigger UI update for turn change
        if (this.onTurnChange) {
            this.onTurnChange(this.currentTurn);
        }
    }

    mainPhase() {
        // Main phase logic - can play cards, use abilities, etc.
        // For now, this is a placeholder that can be extended
    }

    combatPhase() {
        // Resolve combat between attacking and defending creatures
        // This would typically involve:
        // 1. Declaring attackers
        // 2. Declaring blockers
        // 3. Calculating damage
        // 4. Applying damage
        // 5. Removing destroyed creatures
        
        // Placeholder for combat resolution logic
        this.resolveCombat();
    }

    endTurn() {
        // Clean up the turn
        const currentPlayer = this.players[this.currentTurn];
        
        // Reset mana for current player
        currentPlayer.adjustMana(-currentPlayer.mana);
        
        // Draw a card for the next player
        const nextPlayer = this.players[(this.currentTurn + 1) % 2];
        nextPlayer.drawCard();
        
        // Switch to next player
        this.currentTurn = (this.currentTurn + 1) % 2;
        
        // Start the next player's turn
        this.startTurn();
        
        // Trigger UI update for turn change
        if (this.onTurnChange) {
            this.onTurnChange(this.currentTurn);
        }
    }

    playCard(cardIndex, target = null) {
        const currentPlayer = this.players[this.currentTurn];
        const card = currentPlayer.playCard(cardIndex);
        
        if (card) {
            this.battlefield.push({
                card: card,
                owner: this.currentTurn,
                position: this.battlefield.length
            });
            
            // Trigger UI update for card played
            if (this.onCardPlayed) {
                this.onCardPlayed(card, this.currentTurn);
            }
            
            return true;
        }
        return false;
    }

    resolveCombat() {
        // Simple combat resolution logic
        // This would be more complex in a full implementation
        for (let i = 0; i < this.battlefield.length; i++) {
            const creature = this.battlefield[i];
            if (creature.card.attack > 0) {
                // Apply damage to opponent
                const opponent = this.players[(this.currentTurn + 1) % 2];
                opponent.loseLife(creature.card.attack);
            }
        }
        
        // Remove destroyed creatures (those with 0 or less defense)
        this.battlefield = this.battlefield.filter(creature => creature.card.defense > 0);
    }

    // Event hooks for UI updates
    onTurnChange(callback) {
        this.onTurnChange = callback;
    }

    onCardPlayed(callback) {
        this.onCardPlayed = callback;
    }
}