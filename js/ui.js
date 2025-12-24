const UI = {
    elements: {
        pokemonGrid: document.getElementById('pokemonGrid'),
        loading: document.getElementById('loading')
    },

    showLoading() {
        this.elements.loading.classList.add('loading--active');
        this.elements.pokemonGrid.innerHTML = '';
    },

    hideLoading() {
        this.elements.loading.classList.remove('loading--active');
    },

    renderPokemonCard(pokemon) {
        const mainType = pokemon.types[0].type.name;
        const sprite = pokemon.sprites.other['official-artwork'].front_default 
            || pokemon.sprites.front_default;

        return `
            <article class="pokemon-card" data-id="${pokemon.id}">
                <div class="pokemon-card__header">
                    <span class="pokemon-card__type-badge pokemon-card__type-badge--${mainType}">${mainType}</span>
                    <span class="pokemon-card__id">#${String(pokemon.id).padStart(3, '0')}</span>
                </div>
                <div class="pokemon-card__image-container">
                    <img 
                        src="${sprite}" 
                        alt="${pokemon.name}" 
                        class="pokemon-card__image"
                        loading="lazy"
                    >
                </div>
                <h3 class="pokemon-card__name">${pokemon.name}</h3>
            </article>
        `;
    },

    renderPokemonList(pokemonList) {
        if (pokemonList.length === 0) {
            this.elements.pokemonGrid.innerHTML = `
                <div class="no-results">
                    <div class="no-results__icon">🔍</div>
                    <p class="no-results__text">Nenhum Pokémon encontrado</p>
                </div>
            `;
            return;
        }
        this.elements.pokemonGrid.innerHTML = pokemonList.map(p => this.renderPokemonCard(p)).join('');
    }
};
