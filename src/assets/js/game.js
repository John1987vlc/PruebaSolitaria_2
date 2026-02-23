import { Player } from './player.js';
import { Deck } from './deck.js';
import { Card } from './card.js';

export class Game {
    constructor(player1Name, player2Name) {
        this.players = [
            new Player(player1Name),
            new Player(player2Name)
        ];
        this.currentTurn = 0;
        this.battlefield = [[], []]; // Two battlefields, one for each player
        this.manaPool = [0, 0]; // Mana pool for each player
        this.gameStarted = false;
        
        // Initialize decks and draw opening hands
        this.initializeGame();
    }

    initializeGame() {
        // Shuffle decks for both players
        this.players[0]._deck.shuffle();
        this.players[1]._deck.shuffle();
        
        // Draw opening hands (typically 7 cards)
        for (let i = 0; i < 7; i++) {
            this.players[0].drawCard();
            this.players[1].drawCard();
        }
        
        this.gameStarted = true;
    }

    startTurn() {
        // Grant mana to current player
        const currentPlayer = this.players[this.currentTurn];
        this.manaPool[this.currentTurn] = Math.min(10, this.manaPool[this.currentTurn] + 1);
        currentPlayer.gainMana(1);
        
        // Trigger turn change event
        this.onTurnChange?.(this.currentTurn);
    }

    endTurn() {
        // Resolve combat
        this.resolveCombat();
        
        // Pass turn to next player
        this.currentTurn = (this.currentTurn + 1) % 2;
        
        // Start next player's turn
        this.startTurn();
    }

    playCard(cardIndex, target = null) {
        const currentPlayer = this.players[this.currentTurn];
        const opponent = this.players[(this.currentTurn + 1) % 2];
        
        // Check if player has enough mana
        const card = currentPlayer._hand[cardIndex];
        if (!card || currentPlayer.mana < card.cost) {
            return false;
        }
        
        // Play the card
        const playedCard = currentPlayer.playCard(cardIndex);
        if (!playedCard) {
            return false;
        }
        
        // Add to battlefield
        this.battlefield[this.currentTurn].push(playedCard);
        
        // Trigger card played event
        this.onCardPlayed?.(playedCard, this.currentTurn);
        
        return true;
    }

    resolveCombat() {
        // Simple combat resolution - each attacking card deals damage to defending card
        const attacker = this.battlefield[this.currentTurn][0];
        const defender = this.battlefield[(this.currentTurn + 1) % 2][0];
        
        if (attacker && defender) {
            // Apply damage
            defender.defense -= attacker.attack;
            attacker.defense -= defender.attack;
            
            // Remove dead cards
            if (defender.defense <= 0) {
                this.battlefield[(this.currentTurn + 1) % 2].shift();
            }
            if (attacker.defense <= 0) {
                this.battlefield[this.currentTurn].shift();
            }
        }
    }

    // Event hooks for UI updates
    onTurnChange(callback) {
        this.onTurnChange = callback;
    }

    onCardPlayed(callback) {
        this.onCardPlayed = callback;
    }

    // Getters
    get currentPlayer() {
        return this.players[this.currentTurn];
    }

    get opponent() {
        return this.players[(this.currentTurn + 1) % 2];
    }
}