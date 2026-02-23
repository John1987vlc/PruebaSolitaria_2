import { Card } from './card.js';

export class Deck {
    constructor(cards = []) {
        this._cards = cards;
        this._originalCards = cards.map(card => new Card({
            name: card.name,
            cost: card.cost,
            attack: card.attack,
            defense: card.defense,
            type: card.type,
            abilities: [...card.abilities]
        }));
    }

    shuffle() {
        // Fisher-Yates shuffle algorithm
        for (let i = this._cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this._cards[i], this._cards[j]] = [this._cards[j], this._cards[i]];
        }
    }

    draw() {
        if (this._cards.length === 0) {
            return null;
        }
        return this._cards.pop();
    }

    size() {
        return this._cards.length;
    }

    reset() {
        this._cards = this._originalCards.map(card => new Card({
            name: card.name,
            cost: card.cost,
            attack: card.attack,
            defense: card.defense,
            type: card.type,
            abilities: [...card.abilities]
        }));
    }
}