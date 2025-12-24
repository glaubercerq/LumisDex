# LumisDex

Pokédex interativa desenvolvida como desafio técnico para vaga de Desenvolvedor Front-End.

## Sobre o Projeto

Este projeto consiste em uma Pokédex interativa que consome dados da [PokéAPI](https://pokeapi.co/), permitindo aos usuários explorar informações sobre Pokémon da primeira geração. A aplicação foi desenvolvida utilizando **Vanilla JavaScript**, sem frameworks, conforme requisitado no desafio.

## Funcionalidades

- **Listagem de Pokémon**: Exibição dos 151 Pokémon da primeira geração em cards com imagem, nome, número e tipo
- **Busca**: Pesquisa em tempo real por nome ou número do Pokémon, sem recarregar a página
- **Paginação**: Navegação entre páginas com indicadores numéricos e botões anterior/próximo
- **Navegação SPA**: Alternância entre páginas Home e Pokédex sem reload
- **Responsividade**: Layout adaptável para desktop, tablet e mobile

## Tecnologias Utilizadas

- HTML5
- CSS3 (Flexbox, Grid, Custom Properties, Animations)
- JavaScript ES6+ (Vanilla)
- PokéAPI (API REST)

## Como Executar

1. Clone o repositório:
```bash
git clone https://github.com/glaubercerq/LumisDex.git
```

2. Acesse a pasta do projeto:
```bash
cd LumisDex
```

3. Abra o arquivo `index.html` no navegador ou utilize um servidor local:
```bash
# Usando Python
python -m http.server 8000

# Usando Node.js (npx)
npx serve
```

4. Acesse `http://localhost:8000` no navegador

## Estrutura do Projeto

```
LumisDex/
├── assets/
│   └── pokeball.svg
├── css/
│   └── styles.css
├── js/
│   ├── api.js          # Serviço de comunicação com PokéAPI
│   ├── ui.js           # Manipulação do DOM e renderização
│   └── app.js          # Lógica principal e gerenciamento de estado
├── index.html
└── README.md
```

## Arquitetura e Decisões Técnicas

### Vanilla JavaScript
Optei por utilizar JavaScript puro conforme solicitado no desafio, demonstrando domínio dos fundamentos da linguagem sem dependência de frameworks.

### Organização do Código
O código foi separado em módulos com responsabilidades definidas:
- **api.js**: Camada de serviço para requisições HTTP
- **ui.js**: Responsável pela renderização e manipulação do DOM
- **app.js**: Controlador principal com gerenciamento de estado

### CSS Moderno
Utilizei recursos modernos do CSS como:
- CSS Custom Properties para tematização
- CSS Grid e Flexbox para layouts responsivos
- Animações CSS para melhor experiência do usuário

### Performance
- Lazy loading de imagens
- Carregamento sob demanda (Pokémon só são carregados ao acessar a Pokédex)
- Paginação para evitar renderização excessiva

### Git Flow
O projeto foi desenvolvido seguindo o Git Flow com branches organizadas:
- `main`: Código de produção
- `develop`: Integração de features
- `feature/*`: Desenvolvimento de funcionalidades isoladas

## API Utilizada

[PokéAPI](https://pokeapi.co/) - API RESTful gratuita com dados de Pokémon.

Endpoints utilizados:
- `GET /pokemon?limit=151` - Lista dos Pokémon
- `GET /pokemon/{id}` - Detalhes de um Pokémon

## Autor

**Glauber Cerqueira**

- GitHub: [@glaubercerq](https://github.com/glaubercerq)
