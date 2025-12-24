const App = {
    state: {
        allPokemon: [],
        displayedPokemon: []
    },

    async init() {
        await this.loadAllPokemon();
    },

    async loadAllPokemon() {
        UI.showLoading();
        try {
            const data = await PokemonAPI.getAllPokemon(151);
            const pokemonPromises = data.results.map(p => PokemonAPI.getPokemonDetails(p.name));
            this.state.allPokemon = await Promise.all(pokemonPromises);
            this.state.displayedPokemon = [...this.state.allPokemon];
            UI.renderPokemonList(this.state.displayedPokemon);
        } catch (error) {
            console.error('Erro ao carregar Pokémon:', error);
        } finally {
            UI.hideLoading();
        }
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
