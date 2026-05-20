import { query } from "../db.js";

// Buscar todos
export const getClients = async () => {
  const { rows } = await query("SELECT * FROM clientes");
  return rows;
};

// Criar cliente
export const createClient = async (clientData) => {
  const { name, email, job, rate, isactive } = clientData;

  const result = await query(
    `INSERT INTO clientes (name, email, job, rate, isactive)
     VALUES (?, ?, ?, ?, ?)`,
    [name, email, job, rate, isactive]
  );

  const { rows } = await query(
    "SELECT * FROM clientes WHERE id = ?",
    [result.rows.insertId]
  );

  return rows[0];
};

// Atualizar cliente (mantém dados antigos se não enviar)
export const updateClient = async (clientId, clientData) => {
  const { rows } = await query(
    "SELECT * FROM clientes WHERE id = ?",
    [clientId]
  );

  if (rows.length === 0) return null;

  const old = rows[0];

  const name = clientData.name ?? old.name;
  const email = clientData.email ?? old.email;
  const job = clientData.job ?? old.job;
  const rate = clientData.rate ?? old.rate;
  const isactive = clientData.isactive ?? old.isactive;

  await query(
    `UPDATE clientes
     SET name=?, email=?, job=?, rate=?, isactive=?
     WHERE id=?`,
    [name, email, job, rate, isactive, clientId]
  );

  const updated = await query(
    "SELECT * FROM clientes WHERE id = ?",
    [clientId]
  );

  return updated.rows[0];
};

// Deletar cliente
export const deleteClient = async (clientId) => {
  const { rows } = await query(
    "SELECT * FROM clientes WHERE id = ?",
    [clientId]
  );

  if (rows.length === 0) return false;

  const result = await query(
    "DELETE FROM clientes WHERE id = ?",
    [clientId]
  );

  return result.rowCount > 0;
};

// Buscar clientes
export const searchClients = async (searchTerm) => {
  const term = `%${searchTerm}%`;

  const { rows } = await query(
    `SELECT * FROM clientes
     WHERE name LIKE ?
     OR email LIKE ?
     OR job LIKE ?`,
    [term, term, term]
  );

  return rows;
};