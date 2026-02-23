import { Deck } from './deck.js';

export class Player {
    constructor(name) {
        this._name = name;
        this._life = 20;
        this._mana = 0;
        this._hand = [];
        this._deck = new Deck();
    }

    drawCard() {
        const card = this._deck.draw();
        if (card) {
            this._hand.push(card);
        }
        return card;
    }

    playCard(cardIndex) {
        if (cardIndex < 0 || cardIndex >= this._hand.length) {
            return null;
        }
        const card = this._hand.splice(cardIndex, 1)[0];
        this._mana -= card.cost;
        return card;
    }

    gainMana(amount) {
        this._mana += amount;
    }

    loseLife(amount) {
        this._life -= amount;
    }

    adjustMana(amount) {
        this._mana += amount;
    }

    get name() {
        return this._name;
    }

    get life() {
        return this._life;
    }

    get mana() {
        return this._mana;
    }

    get hand() {
        return this._hand;
    }

    get handSize() {
        return this._hand.length;
    }

    get deckSize() {
        return this._deck.size();
    }

    get currentMana() {
        return this._mana;
    }
}