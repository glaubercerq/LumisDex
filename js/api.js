const API_BASE_URL = 'https://pokeapi.co/api/v2';

const PokemonAPI = {
    async getPokemonList(limit = 20, offset = 0) {
        const response = await fetch(`${API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
        if (!response.ok) throw new Error('Erro ao buscar lista de Pokémon');
        return response.json();
    },

    async getPokemonDetails(nameOrId) {
        const response = await fetch(`${API_BASE_URL}/pokemon/${nameOrId}`);
        if (!response.ok) throw new Error(`Pokémon ${nameOrId} não encontrado`);
        return response.json();
    },

    async getPokemonSpecies(nameOrId) {
        const response = await fetch(`${API_BASE_URL}/pokemon-species/${nameOrId}`);
        if (!response.ok) throw new Error('Erro ao buscar espécie do Pokémon');
        return response.json();
    },

    async getTypes() {
        const response = await fetch(`${API_BASE_URL}/type`);
        if (!response.ok) throw new Error('Erro ao buscar tipos');
        return response.json();
    },

    async getPokemonByType(type) {
        const response = await fetch(`${API_BASE_URL}/type/${type}`);
        if (!response.ok) throw new Error('Erro ao buscar Pokémon por tipo');
        return response.json();
    },

    async getAllPokemon(limit = 151) {
        const response = await fetch(`${API_BASE_URL}/pokemon?limit=${limit}&offset=0`);
        if (!response.ok) throw new Error('Erro ao buscar todos os Pokémon');
        return response.json();
    }
};
