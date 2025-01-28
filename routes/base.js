const { Pool } = require("pg");
// faz conexão com o banco

base.js;
const { Pool } = require("pg");

// Executa uma consulta SQL
async function executarSQL(query, params = []) {
  const client = await pool.connect();
  try {
    const resultado = await client.query(query, params);
    return resultado.rows;
  } catch (error) {
    console.error("Erro ao executar a consulta:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Retorna uma linha específica de um resultado de consulta
async function retornaLinha(query, params = []) {
  const resultado = await executarSQL(query, params);
  return resultado[0] || null;
}

// Verifica se a consulta gerou algum resultado
async function verificaResultado(query, params = []) {
  const resultado = await executarSQL(query, params);
  return resultado.length > 0;
}

// Desconecta o pool quando necessário
async function desconectar() {
  await pool.end();
}

module.exports = { executarSQL, retornaLinha, verificaResultado, desconectar };

// Importa a biblioteca pg para conexão com o PostgreSQL

// Configura as credenciais para conexão com o banco de dados
const pool = new Pool({
  host: "localhost",
  port: 8081,
  database: "db_web2",
  user: "admin",
  password: "postgres",
});

// Executa uma consulta e retorna o resultado
async function executarSQL(query, params = []) {
  const client = await pool.connect();
  try {
    const resultado = await client.query(query, params);
    return resultado.rows;
  } catch (error) {
    console.error("Erro ao executar a consulta:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Retorna a primeira linha de um resultado de consulta
async function retornaLinha(query, params = []) {
  const resultado = await executarSQL(query, params);
  return resultado[0] || null;
}

// Verifica se a consulta gerou algum resultado
async function verificaResultado(query, params = []) {
  const resultado = await executarSQL(query, params);
  return resultado.length > 0;
}

// Função para desconectar o pool quando necessário
async function desconectar() {
  await pool.end();
}
