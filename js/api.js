const API_BASE_URL = 'https://pokeapi.co/api/v2';

const PokemonAPI = {
    async getPokemonList(limit = 15, offset = 0) {
        const response = await fetch(`${API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
        if (!response.ok) throw new Error('Erro ao buscar lista de Pokémon');
        return response.json();
    },

    async getPokemonDetails(nameOrId) {
        const response = await fetch(`${API_BASE_URL}/pokemon/${nameOrId}`);
        if (!response.ok) throw new Error(`Pokémon ${nameOrId} não encontrado`);
        return response.json();
    },

    async getTotalCount() {
        const response = await fetch(`${API_BASE_URL}/pokemon?limit=1`);
        if (!response.ok) throw new Error('Erro ao buscar contagem');
        const data = await response.json();
        return Math.min(data.count, 151);
    }
};
