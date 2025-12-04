const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "segredo_padrao";

app.use(cors());
app.use(express.json());

const isProduction = !!process.env.DATABASE_URL;
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:Cleison23!08!@localhost:5432/ctrlstock_db",
  ...(isProduction && { ssl: { rejectUnauthorized: false } }),
});

let lastUnknownTag = { uid: null, time: 0 };

// --- ROTAS AUXILIARES ---
app.get("/test-db", async (req, res) => {
  try {
    const r = await pool.query("SELECT NOW()");
    res.json({ success: true, dbTime: r.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/last-unknown", (req, res) => {
  if (lastUnknownTag.uid && Date.now() - lastUnknownTag.time < 30000) {
    const uid = lastUnknownTag.uid;
    lastUnknownTag = { uid: null, time: 0 };
    return res.json({ uid });
  }
  res.json({ uid: null });
});

// --- MOVIMENTAÇÕES (ESP32) ---
app.post("/api/movements", async (req, res) => {
  let { uid, tipo } = req.body;
  if (!uid) return res.status(400).json({ message: "UID ausente" });

  uid = uid.toUpperCase();

  try {
    const prod = await pool.query(
      "SELECT id FROM produtos WHERE uid_etiqueta=$1 AND ativo=true",
      [uid]
    );

    if (!prod.rows.length) {
      lastUnknownTag = { uid, time: Date.now() };
      console.log(`Tag Nova: ${uid}`);
      return res.status(404).json({ message: "Não cadastrado" });
    }

    let tipoFinal = "leitura";
    if (tipo === "saida") {
      tipoFinal = "saida";
    }

    await pool.query(
      "INSERT INTO movimentacoes (produto_id, tipo) VALUES ($1, $2)",
      [prod.rows[0].id, tipoFinal]
    );
    console.log(`Sucesso: ${uid} -> ${tipoFinal}`);
    res.status(201).json({ success: true });
  } catch (err) {
    console.error("ERRO MOVIMENTACAO:", err);
    res.status(500).json({ message: "Erro interno" });
  }
});

// --- CRUD PRODUTOS ---
app.post("/api/products", async (req, res) => {
  const { nome, uid_etiqueta, descricao } = req.body;
  const uidFinal = uid_etiqueta.toUpperCase();

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const r = await client.query(
      "INSERT INTO produtos (nome, uid_etiqueta, descricao) VALUES ($1, $2, $3) RETURNING *",
      [nome, uidFinal, descricao]
    );
    await client.query(
      "INSERT INTO movimentacoes (produto_id, tipo) VALUES ($1, 'entrada')",
      [r.rows[0].id]
    );
    await client.query("COMMIT");
    res.status(201).json({ success: true, data: r.rows[0] });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(err.code === "23505" ? 409 : 500).json({ message: err.message });
  } finally {
    client.release();
  }
});

app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, uid_etiqueta, descricao } = req.body;
  const uidFinal = uid_etiqueta.toUpperCase();
  try {
    const r = await pool.query(
      "UPDATE produtos SET nome=$1, uid_etiqueta=$2, descricao=$3 WHERE id=$4 RETURNING *",
      [nome, uidFinal, descricao, id]
    );
    if (r.rows.length) {
      await pool.query(
        "INSERT INTO movimentacoes (produto_id, tipo) VALUES ($1, 'editado')",
        [id]
      );
      res.json({ success: true, data: r.rows[0] });
    } else {
      res.status(404).json({ message: "Não encontrado" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      "INSERT INTO movimentacoes (produto_id, tipo) VALUES ($1, 'excluido')",
      [id]
    );
    const r = await pool.query(
      "UPDATE produtos SET ativo = false, uid_etiqueta = NULL WHERE id=$1 RETURNING *",
      [id]
    );
    if (r.rows.length) res.json({ success: true });
    else res.status(404).json({ message: "Não encontrado" });
  } catch {
    res.status(500).json({ success: false });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const r = await pool.query(
      "SELECT * FROM produtos WHERE ativo = true ORDER BY nome ASC"
    );
    res.json({ success: true, data: r.rows });
  } catch {
    res.status(500).json({ success: false });
  }
});

app.get("/api/movements", async (req, res) => {
  try {
    const r = await pool.query(`
      SELECT 
        m.id, 
        m.timestamp, 
        m.tipo, 
        m.produto_id,
        p.nome, 
        p.uid_etiqueta 
      FROM movimentacoes m 
      LEFT JOIN produtos p ON m.produto_id = p.id 
      ORDER BY m.timestamp DESC 
      LIMIT 100
    `);

    res.json({ success: true, data: r.rows });
  } catch (err) {
    console.error("Erro ao buscar movimentações:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- AUTH ---
app.post("/auth/register", async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const hash = await bcrypt.hash(senha, 10);
    const r = await pool.query(
      "INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING id, nome, email",
      [nome, email, hash]
    );
    res.status(201).json({ success: true, user: r.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/auth/login", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const r = await pool.query("SELECT * FROM usuarios WHERE email = $1", [
      email,
    ]);
    if (!r.rows.length || !(await bcrypt.compare(senha, r.rows[0].senha_hash)))
      return res.status(400).json({ message: "Inválido" });
    const token = jwt.sign({ id: r.rows[0].id }, JWT_SECRET);
    res.json({ success: true, token, user: r.rows[0] });
  } catch {
    res.status(500).json({ message: "Erro servidor" });
  }
});

app.listen(port, () => console.log(`Rodando na porta ${port}`));
