const API_BASE_URL = 'https://pokeapi.co/api/v2';

const PokemonAPI = {
    async getPokemonList(limit = 151, offset = 0) {
        const response = await fetch(`${API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
        if (!response.ok) throw new Error('Erro ao buscar lista de Pokémon');
        return response.json();
    },

    async getPokemonDetails(nameOrId) {
        const response = await fetch(`${API_BASE_URL}/pokemon/${nameOrId}`);
        if (!response.ok) throw new Error(`Pokémon ${nameOrId} não encontrado`);
        return response.json();
    },

    async getPokemonByType(type) {
        const response = await fetch(`${API_BASE_URL}/type/${type}`);
        if (!response.ok) throw new Error(`Tipo ${type} não encontrado`);
        const data = await response.json();
        return data.pokemon
            .map(p => {
                const urlParts = p.pokemon.url.split('/');
                const id = parseInt(urlParts[urlParts.length - 2]);
                return { name: p.pokemon.name, id };
            })
            .filter(p => p.id <= 151)
            .sort((a, b) => a.id - b.id);
    }
};
