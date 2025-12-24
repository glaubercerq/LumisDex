const App = {
    state: {
        allPokemon: [],
        filteredPokemon: [],
        displayedPokemon: [],
        currentPage: 1,
        itemsPerPage: 15,
        totalPages: 1,
        searchTerm: ''
    },

    async init() {
        await this.loadAllPokemon();
        this.bindEvents();
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
