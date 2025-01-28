
// Aluno adiciona um conhecimento no perfil

const express = require('express');
const cors = require('cors');
const { executarSQL } = require('./base');  // Importando a função de consulta do base.js

// Criar uma instância do Express
const app = express();
const port = 3000;

// Configurar o CORS para permitir solicitações de diferentes origens (frontend)
app.use(cors());

// Endpoint para obter os conhecimentos
app.get('/api/skills', async (req, res) => {
    const query = 'SELECT nome FROM conhecimentos'; // Altere conforme o nome correto da tabela e coluna
    try {
        const skills = await executarSQL(query); // Usando a função do base.js para executar a consulta
        res.json(skills); // Retorna os conhecimentos encontrados
    } catch (err) {
        console.error('Erro ao buscar conhecimentos:', err);
        res.status(500).send('Erro ao buscar conhecimentos');
    }
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
