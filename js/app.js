const App = {
    state: {
        allPokemon: [],
        filteredPokemon: [],
        displayedPokemon: [],
        currentPage: 1,
        itemsPerPage: 15,
        totalPages: 1,
        searchTerm: '',
        currentPageView: 'home',
        isLoaded: false
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

        if (page === 'pokedex' && !this.state.isLoaded) {
            this.loadAllPokemon();
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
    },

    async loadAllPokemon() {
        UI.showLoading();
        try {
            const data = await PokemonAPI.getAllPokemon(151);
            const pokemonPromises = data.results.map(p => PokemonAPI.getPokemonDetails(p.name));
            this.state.allPokemon = await Promise.all(pokemonPromises);
            this.state.filteredPokemon = [...this.state.allPokemon];
            this.state.isLoaded = true;
            this.updatePagination();
            this.renderCurrentPage();
        } catch (error) {
            console.error('Erro ao carregar Pokémon:', error);
        } finally {
            UI.hideLoading();
        }
    },

    handleSearch(term) {
        this.state.searchTerm = term.toLowerCase().trim();
        this.applyFilters();
    },

    applyFilters() {
        let result = [...this.state.allPokemon];

        if (this.state.searchTerm) {
            result = result.filter(p => 
                p.name.toLowerCase().includes(this.state.searchTerm) ||
                String(p.id).includes(this.state.searchTerm)
            );
        }

        this.state.filteredPokemon = result;
        this.state.currentPage = 1;
        this.updatePagination();
        this.renderCurrentPage();
    },

    updatePagination() {
        this.state.totalPages = Math.ceil(this.state.filteredPokemon.length / this.state.itemsPerPage) || 1;
        UI.updatePagination(this.state.currentPage, this.state.totalPages, (page) => this.goToPage(page));
        
        if (this.state.filteredPokemon.length <= this.state.itemsPerPage) {
            UI.hidePagination();
        } else {
            UI.showPagination();
        }
    },

    goToPage(page) {
        if (page < 1 || page > this.state.totalPages) return;
        this.state.currentPage = page;
        this.updatePagination();
        this.renderCurrentPage();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    renderCurrentPage() {
        const start = (this.state.currentPage - 1) * this.state.itemsPerPage;
        const end = start + this.state.itemsPerPage;
        this.state.displayedPokemon = this.state.filteredPokemon.slice(start, end);
        UI.renderPokemonList(this.state.displayedPokemon);
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
