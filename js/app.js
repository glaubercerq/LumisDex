const App = {
    state: {
        currentPage: 1,
        itemsPerPage: 15,
        totalPages: 1,
        totalCount: 151,
        searchTerm: '',
        currentPageView: 'home',
        isInitialized: false,
        cachedPokemon: {},
        allPokemonNames: []
    },

    init() {
        this.bindNavigation();
        this.bindEvents();
    },

    bindNavigation() {
        const navLinks = document.querySelectorAll('.header__nav-link');
        const exploreButton = document.getElementById('exploreButton');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.navigateTo(page);
            });
        });

        if (exploreButton) {
            exploreButton.addEventListener('click', () => {
                this.navigateTo('pokedex');
            });
        }
    },

    navigateTo(page) {
        const navLinks = document.querySelectorAll('.header__nav-link');
        const pages = document.querySelectorAll('.page');

        navLinks.forEach(link => {
            link.classList.remove('header__nav-link--active');
            if (link.dataset.page === page) {
                link.classList.add('header__nav-link--active');
            }
        });

        pages.forEach(p => {
            p.classList.remove('page--active');
        });

        const targetPage = document.getElementById(`${page}Page`);
        if (targetPage) {
            targetPage.classList.add('page--active');
        }

        this.state.currentPageView = page;

        if (page === 'pokedex' && !this.state.isInitialized) {
            this.initializePokedex();
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    bindEvents() {
        UI.elements.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        UI.elements.searchButton.addEventListener('click', () => this.handleSearch(UI.elements.searchInput.value));
        UI.elements.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch(e.target.value);
        });
        UI.elements.prevButton.addEventListener('click', () => this.goToPage(this.state.currentPage - 1));
        UI.elements.nextButton.addEventListener('click', () => this.goToPage(this.state.currentPage + 1));

        UI.elements.pokemonGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.pokemon-card');
            if (card) {
                const pokemonId = parseInt(card.dataset.id);
                this.openPokemonDetail(pokemonId);
            }
        });

        UI.elements.modalClose.addEventListener('click', () => UI.closeModal());
        UI.elements.modalOverlay.addEventListener('click', () => UI.closeModal());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') UI.closeModal();
        });
    },

    async openPokemonDetail(pokemonId) {
        UI.openModal();
        UI.elements.modalBody.innerHTML = '<div class="loading loading--active"><div class="loading__spinner"></div></div>';

        try {
            let pokemon = this.state.cachedPokemon[pokemonId];
            if (!pokemon) {
                pokemon = await PokemonAPI.getPokemonDetails(pokemonId);
                this.state.cachedPokemon[pokemonId] = pokemon;
            }
            UI.renderPokemonDetail(pokemon);
        } catch (error) {
            console.error('Erro ao carregar detalhes:', error);
            UI.elements.modalBody.innerHTML = '<p style="text-align: center; color: var(--color-text-muted);">Erro ao carregar detalhes</p>';
        }
    },

    async initializePokedex() {
        UI.showLoading();
        try {
            const data = await PokemonAPI.getPokemonList(151, 0);
            this.state.allPokemonNames = data.results.map((p, index) => ({
                name: p.name,
                id: index + 1
            }));
            this.state.totalCount = 151;
            this.state.isInitialized = true;
            await this.loadCurrentPage();
        } catch (error) {
            console.error('Erro ao inicializar Pokédex:', error);
        }
    },

    async loadCurrentPage() {
        UI.showLoading();
        try {
            let pokemonToLoad;

            if (this.state.searchTerm) {
                const filtered = this.state.allPokemonNames.filter(p =>
                    p.name.toLowerCase().includes(this.state.searchTerm) ||
                    String(p.id).includes(this.state.searchTerm)
                );
                this.state.totalCount = filtered.length;
                const start = (this.state.currentPage - 1) * this.state.itemsPerPage;
                const end = start + this.state.itemsPerPage;
                pokemonToLoad = filtered.slice(start, end);
            } else {
                this.state.totalCount = 151;
                const offset = (this.state.currentPage - 1) * this.state.itemsPerPage;
                const limit = Math.min(this.state.itemsPerPage, 151 - offset);
                pokemonToLoad = this.state.allPokemonNames.slice(offset, offset + limit);
            }

            const pokemonDetails = await Promise.all(
                pokemonToLoad.map(async (p) => {
                    if (this.state.cachedPokemon[p.id]) {
                        return this.state.cachedPokemon[p.id];
                    }
                    const details = await PokemonAPI.getPokemonDetails(p.id);
                    this.state.cachedPokemon[p.id] = details;
                    return details;
                })
            );

            this.updatePagination();
            UI.renderPokemonList(pokemonDetails);
        } catch (error) {
            console.error('Erro ao carregar página:', error);
        } finally {
            UI.hideLoading();
        }
    },

    handleSearch(term) {
        this.state.searchTerm = term.toLowerCase().trim();
        this.state.currentPage = 1;
        this.loadCurrentPage();
    },

    updatePagination() {
        this.state.totalPages = Math.ceil(this.state.totalCount / this.state.itemsPerPage) || 1;
        UI.updatePagination(this.state.currentPage, this.state.totalPages, (page) => this.goToPage(page));

        if (this.state.totalCount <= this.state.itemsPerPage) {
            UI.hidePagination();
        } else {
            UI.showPagination();
        }
    },

    goToPage(page) {
        if (page < 1 || page > this.state.totalPages) return;
        this.state.currentPage = page;
        this.loadCurrentPage();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
