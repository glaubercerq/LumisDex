const UI = {
    elements: {
        pokemonGrid: document.getElementById('pokemonGrid'),
        loading: document.getElementById('loading'),
        searchInput: document.getElementById('searchInput'),
        searchButton: document.getElementById('searchButton'),
        prevButton: document.getElementById('prevButton'),
        nextButton: document.getElementById('nextButton'),
        paginationNumbers: document.getElementById('paginationNumbers'),
        pagination: document.getElementById('pagination')
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
