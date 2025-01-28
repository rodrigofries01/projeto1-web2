//aluno adiciona um projeto no perfil





const express = require('express');
const bodyParser = require('body-parser');
const { retornaLinha } = require('./base'); // Importa função do base.js

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Rota para adicionar um novo projeto
app.post('/addProject', async (req, res) => {
    try {
      const { projectName, projectSummary, projectLink, projectKeywords } = req.body;
  
      const query = `
        INSERT INTO projetos (nome, resumo, link, palavras_chave)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
  
      const palavrasChave = projectKeywords.join(', '); // Concatena as palavras-chave em uma string
      const novoProjeto = await retornaLinha(query, [projectName, projectSummary, projectLink, palavrasChave]);
  
      if (novoProjeto) {
        res.status(201).send('<script>alert("Projeto adicionado com sucesso!"); window.location.href = "/index-logado.html";</script>');
      } else {
        res.status(400).send('<script>alert("Não foi possível adicionar o projeto."); window.history.back();</script>');
      }
    } catch (error) {
      console.error('Erro ao adicionar o projeto:', error);
      res.status(500).send('<script>alert("Erro interno do servidor. Tente novamente mais tarde."); window.history.back();</script>');
    }
  });
  
  // Função para iniciar o servidor
  function iniciarServidor() {
    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  }
  
  // Inicia o servidor diretamente
  iniciarServidor();
  