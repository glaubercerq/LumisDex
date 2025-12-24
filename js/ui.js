const UI = {
    elements: {
        pokemonGrid: document.getElementById('pokemonGrid'),
        loading: document.getElementById('loading'),
        searchInput: document.getElementById('searchInput'),
        searchButton: document.getElementById('searchButton'),
        typeFilter: document.getElementById('typeFilter'),
        prevButton: document.getElementById('prevButton'),
        nextButton: document.getElementById('nextButton'),
        paginationNumbers: document.getElementById('paginationNumbers'),
        pagination: document.getElementById('pagination'),
        modal: document.getElementById('pokemonModal'),
        modalOverlay: document.getElementById('modalOverlay'),
        modalClose: document.getElementById('modalClose'),
        modalBody: document.getElementById('modalBody')
    },

    pokemonTypes: [
        'normal', 'fire', 'water', 'electric', 'grass', 'ice',
        'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
        'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
    ],

    typeColors: {
        normal: '#9da0aa',
        fire: '#ff9c54',
        water: '#4fc1e9',
        electric: '#f7d02c',
        grass: '#63bb5b',
        ice: '#74cec0',
        fighting: '#ce4069',
        poison: '#ab6ac8',
        ground: '#d97746',
        flying: '#92aade',
        psychic: '#f97176',
        bug: '#90c12c',
        rock: '#c7b78b',
        ghost: '#5269ac',
        dragon: '#0a6dc4',
        dark: '#5a5366',
        steel: '#5a8ea1',
        fairy: '#ec8fe6'
    },

    showLoading() {
        this.elements.loading.classList.add('loading--active');
        this.elements.pokemonGrid.innerHTML = '';
    },

    hideLoading() {
        this.elements.loading.classList.remove('loading--active');
    },

    renderTypeFilter() {
        const options = this.pokemonTypes.map(type => {
            const typeName = type.charAt(0).toUpperCase() + type.slice(1);
            return `<option value="${type}">${typeName}</option>`;
        }).join('');
        this.elements.typeFilter.innerHTML = `<option value="">Todos os tipos</option>${options}`;
    },

    renderPokemonCard(pokemon) {
        const mainType = pokemon.types[0].type.name;
        const sprite = pokemon.sprites.other['official-artwork'].front_default 
            || pokemon.sprites.front_default;

        return `
            <article class="pokemon-card pokemon-card--${mainType}" data-id="${pokemon.id}" data-type="${mainType}">
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

    renderPokemonList(pokemonList, totalCount = null) {
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
    },

    renderPokemonDetail(pokemon) {
        const mainType = pokemon.types[0].type.name;
        const typeColor = this.typeColors[mainType] || this.typeColors.normal;
        const sprite = pokemon.sprites.other['official-artwork'].front_default 
            || pokemon.sprites.front_default;

        const types = pokemon.types.map(t => 
            `<span class="pokemon-detail__type pokemon-card__type-badge--${t.type.name}">${t.type.name}</span>`
        ).join('');

        const statNames = {
            'hp': 'HP',
            'attack': 'ATK',
            'defense': 'DEF',
            'special-attack': 'SpA',
            'special-defense': 'SpD',
            'speed': 'SPD'
        };

        const stats = pokemon.stats.map(s => {
            const percentage = Math.min((s.base_stat / 255) * 100, 100);
            return `
                <div class="pokemon-detail__stat">
                    <span class="pokemon-detail__stat-name">${statNames[s.stat.name] || s.stat.name}</span>
                    <div class="pokemon-detail__stat-bar">
                        <div class="pokemon-detail__stat-fill" style="width: ${percentage}%; background: ${typeColor};"></div>
                    </div>
                    <span class="pokemon-detail__stat-value">${s.base_stat}</span>
                </div>
            `;
        }).join('');

        const abilities = pokemon.abilities.map(a => 
            `<span class="pokemon-detail__ability">${a.ability.name.replace('-', ' ')}</span>`
        ).join('');

        const heightM = (pokemon.height / 10).toFixed(1);
        const weightKg = (pokemon.weight / 10).toFixed(1);

        this.elements.modalBody.innerHTML = `
            <div class="pokemon-detail">
                <div class="pokemon-detail__header" style="background: linear-gradient(180deg, ${typeColor}40 0%, transparent 100%);">
                    <span class="pokemon-detail__id">#${String(pokemon.id).padStart(3, '0')}</span>
                    <img src="${sprite}" alt="${pokemon.name}" class="pokemon-detail__image">
                </div>
                <h2 class="pokemon-detail__name">${pokemon.name}</h2>
                <div class="pokemon-detail__types">${types}</div>
                <div class="pokemon-detail__info">
                    <div class="pokemon-detail__info-item">
                        <span class="pokemon-detail__info-value">${heightM}m</span>
                        <span class="pokemon-detail__info-label">Altura</span>
                    </div>
                    <div class="pokemon-detail__info-item">
                        <span class="pokemon-detail__info-value">${weightKg}kg</span>
                        <span class="pokemon-detail__info-label">Peso</span>
                    </div>
                    <div class="pokemon-detail__info-item">
                        <span class="pokemon-detail__info-value">${pokemon.base_experience || '—'}</span>
                        <span class="pokemon-detail__info-label">Exp Base</span>
                    </div>
                </div>
                <div class="pokemon-detail__stats">
                    <h3 class="pokemon-detail__stats-title">Estatísticas Base</h3>
                    ${stats}
                </div>
                <div class="pokemon-detail__abilities">
                    <h3 class="pokemon-detail__abilities-title">Habilidades</h3>
                    <div class="pokemon-detail__abilities-list">${abilities}</div>
                </div>
            </div>
        `;
    },

    openModal() {
        this.elements.modal.classList.add('modal--active');
        document.body.style.overflow = 'hidden';
    },

    closeModal() {
        this.elements.modal.classList.remove('modal--active');
        document.body.style.overflow = '';
    },

    renderPaginationNumbers(currentPage, totalPages, onPageClick) {
        const numbers = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            const isActive = i === currentPage ? 'pagination__number--active' : '';
            numbers.push(`<button class="pagination__number ${isActive}" data-page="${i}">${i}</button>`);
        }

        this.elements.paginationNumbers.innerHTML = numbers.join('');

        this.elements.paginationNumbers.querySelectorAll('.pagination__number').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.dataset.page);
                onPageClick(page);
            });
        });
    },

    updatePagination(currentPage, totalPages, onPageClick) {
        this.elements.prevButton.disabled = currentPage <= 1;
        this.elements.nextButton.disabled = currentPage >= totalPages;
        this.renderPaginationNumbers(currentPage, totalPages, onPageClick);
    },

    showPagination() {
        this.elements.pagination.style.display = 'flex';
    },

    hidePagination() {
        this.elements.pagination.style.display = 'none';
    }
};
