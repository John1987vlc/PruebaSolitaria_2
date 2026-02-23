export class Card {
    constructor(options) {
        this.name = options.name;
        this.cost = options.cost;
        this.attack = options.attack;
        this.defense = options.defense;
        this.type = options.type;
        this.abilities = options.abilities || [];
    }

    // Getters
    get name() {
        return this._name;
    }

    get cost() {
        return this._cost;
    }

    get attack() {
        return this._attack;
    }

    get defense() {
        return this._defense;
    }

    get type() {
        return this._type;
    }

    get abilities() {
        return this._abilities;
    }

    // Setters
    set name(value) {
        this._name = value;
    }

    set cost(value) {
        this._cost = value;
    }

    set attack(value) {
        this._attack = value;
    }

    set defense(value) {
        this._defense = value;
    }

    set type(value) {
        this._type = value;
    }

    set abilities(value) {
        this._abilities = value;
    }

    play() {
        // Trigger any on-play abilities
        this.abilities.forEach(ability => {
            if (ability.trigger === 'play') {
                ability.effect();
            }
        });
    }

    toJSON() {
        return {
            name: this.name,
            cost: this.cost,
            attack: this.attack,
            defense: this.defense,
            type: this.type,
            abilities: this.abilities
        };
    }
}