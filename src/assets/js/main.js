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
            ${card.abilities && card.abilities.length > 0 
                ? card.abilities.map(ability => `<span class="ability">${ability}</span>`).join('') 
                : 'No abilities'
            }
        </div>
    `;

    container.appendChild(cardElement);
}