const App = {
    state: {
        allPokemon: [],
        filteredPokemon: [],
        displayedPokemon: [],
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
    },

    async loadAllPokemon() {
        UI.showLoading();
        try {
            const data = await PokemonAPI.getAllPokemon(151);
            const pokemonPromises = data.results.map(p => PokemonAPI.getPokemonDetails(p.name));
            this.state.allPokemon = await Promise.all(pokemonPromises);
            this.state.filteredPokemon = [...this.state.allPokemon];
            this.state.displayedPokemon = [...this.state.filteredPokemon];
            UI.renderPokemonList(this.state.displayedPokemon);
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
        this.state.displayedPokemon = [...this.state.filteredPokemon];
        UI.renderPokemonList(this.state.displayedPokemon);
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
