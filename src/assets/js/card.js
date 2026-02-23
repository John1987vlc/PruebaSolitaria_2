export class Card {
    constructor(options) {
        this.name = options.name;
        this.cost = options.cost;
        this.attack = options.attack;
        this.defense = options.defense;
        this.type = options.type;
        this.abilities = options.abilities || [];
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