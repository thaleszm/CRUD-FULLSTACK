import { query } from "../db.js";

// Buscar todos
export const getClients = async () => {
  const result = await query("SELECT * FROM clientes");
  return result.rows;
};

// Criar cliente
export const createClient = async (clientData) => {
  const { name, email, job, rate, isactive } = clientData;

  const result = await query(
    `INSERT INTO clientes (name, email, job, rate, isactive)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, email, job, rate, isactive]
  );

  return result.rows[0];
};

// Atualizar cliente
export const updateClient = async (clientId, clientData) => {
  const existing = await query(
    "SELECT * FROM clientes WHERE id = $1",
    [clientId]
  );

  if (existing.rows.length === 0) return null;

  const old = existing.rows[0];

  const name = clientData.name ?? old.name;
  const email = clientData.email ?? old.email;
  const job = clientData.job ?? old.job;
  const rate = clientData.rate ?? old.rate;
  const isactive = clientData.isactive ?? old.isactive;

  await query(
    `UPDATE clientes
     SET name = $1,
         email = $2,
         job = $3,
         rate = $4,
         isactive = $5
     WHERE id = $6`,
    [name, email, job, rate, isactive, clientId]
  );

  const updated = await query(
    "SELECT * FROM clientes WHERE id = $1",
    [clientId]
  );

  return updated.rows[0];
};

// Deletar cliente
export const deleteClient = async (clientId) => {
  const existing = await query(
    "SELECT * FROM clientes WHERE id = $1",
    [clientId]
  );

  if (existing.rows.length === 0) return false;

  const result = await query(
    "DELETE FROM clientes WHERE id = $1",
    [clientId]
  );

  return result.rowCount > 0;
};

// Buscar clientes
export const searchClients = async (searchTerm) => {
  const term = `%${searchTerm}%`;

  const result = await query(
    `SELECT * FROM clientes
     WHERE name ILIKE $1
     OR email ILIKE $1
     OR job ILIKE $1`,
    [term]
  );

  return result.rows;
};