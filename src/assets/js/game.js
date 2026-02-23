export class Game {
    constructor(player1Name, player2Name) {
        this.players = [
            new Player(player1Name),
            new Player(player2Name)
        ];
        this.currentTurn = 0;
        this.battlefield = [];
        this.manaPool = 0;

        // Initialize players' decks and draw opening hands
        for (let player of this.players) {
            player._deck.shuffle();
            for (let i = 0; i < 7; i++) {
                player.drawCard();
            }
        }
    }

    startTurn() {
        // Regenerate mana for the current player
        this.regenerateMana();
        
        // Draw a card for the current player
        this.players[this.currentTurn].drawCard();
        
        // Trigger UI update event
        if (this.onTurnChange) {
            this.onTurnChange(this.currentTurn);
        }
    }

    endTurn() {
        // Resolve combat
        this.resolveCombat();
        
        // Switch to the other player
        this.currentTurn = 1 - this.currentTurn;
        
        // Start the next player's turn
        this.startTurn();
    }

    regenerateMana() {
        // Give 1 mana to the current player
        this.players[this.currentTurn].gainMana(1);
    }

    spendMana(amount) {
        // Deduct mana from the current player
        const currentPlayer = this.players[this.currentTurn];
        if (currentPlayer.mana >= amount) {
            currentPlayer.adjustMana(-amount);
            return true;
        }
        return false;
    }

    playCard(cardIndex, target = null) {
        const player = this.players[this.currentTurn];
        const card = player.playCard(cardIndex);
        
        if (card) {
            // Spend the mana cost of the card
            if (!this.spendMana(card.cost)) {
                // If player doesn't have enough mana, return card to hand
                player._hand.push(card);
                return false;
            }
            
            // Add card to battlefield
            this.battlefield.push({
                card: card,
                owner: this.currentTurn,
                target: target
            });
            
            // Trigger UI update event
            if (this.onCardPlayed) {
                this.onCardPlayed(card, this.currentTurn);
            }
            
            return true;
        }
        return false;
    }

    resolveCombat() {
        // Simple combat resolution - each attacking card deals damage to defending card
        // This is a simplified version - in a full implementation, this would be more complex
        for (let i = 0; i < this.battlefield.length; i++) {
            const battleCard = this.battlefield[i];
            if (battleCard.card.attack > 0) {
                // For simplicity, we'll just deal damage to the first opposing card
                // In a real implementation, this would be more sophisticated
                for (let j = 0; j < this.battlefield.length; j++) {
                    if (i !== j && this.battlefield[j].owner !== battleCard.owner) {
                        // Deal damage to the opposing card
                        this.battlefield[j].card.defense -= battleCard.card.attack;
                        if (this.battlefield[j].card.defense <= 0) {
                            // Remove destroyed card
                            this.battlefield.splice(j, 1);
                            j--; // Adjust index after removal
                        }
                        break;
                    }
                }
            }
        }
        
        // Remove any cards with 0 or less defense
        this.battlefield = this.battlefield.filter(battleCard => battleCard.card.defense > 0);
    }
}