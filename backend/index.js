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

// Conexão com o Banco (Híbrida: Local ou Render)
const isProduction = !!process.env.DATABASE_URL;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:Cleison23!08!@localhost:5432/ctrlstock_db",
  ...(isProduction && { ssl: { rejectUnauthorized: false } }),
});

// Memória temporária para tags desconhecidas (para facilitar cadastro no Front)
let lastUnknownTag = { uid: null, time: 0 };

// --- ROTAS DE STATUS ---
app.get("/test-db", async (req, res) => {
  try {
    const r = await pool.query("SELECT NOW()");
    res.json({ success: true, dbTime: r.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// O Front-end chama isso para saber se passamos uma tag nova no leitor
app.get("/api/last-unknown", (req, res) => {
  // Só retorna se foi lida nos últimos 30 segundos
  if (lastUnknownTag.uid && Date.now() - lastUnknownTag.time < 30000) {
    const uid = lastUnknownTag.uid;
    lastUnknownTag = { uid: null, time: 0 }; // Limpa após ler
    return res.json({ uid });
  }
  res.json({ uid: null });
});

// --- ROTA DO ESP32 (A Principal) ---
app.post("/api/movements", async (req, res) => {
  let { uid, tipo } = req.body; // ESP32 manda: { "uid": "XX", "tipo": "entrada" }

  if (!uid) return res.status(400).json({ message: "UID ausente" });

  uid = uid.toUpperCase();

  try {
    // 1. Verifica se o produto existe e está ativo
    const prod = await pool.query(
        "SELECT id, nome FROM produtos WHERE uid_etiqueta=$1 AND ativo=true",
        [uid]
    );

    // 2. Se não existir, guarda na memória para cadastro e retorna 404
    if (!prod.rows.length) {
      lastUnknownTag = { uid, time: Date.now() };
      console.log(`[TAG DESCONHECIDA] ${uid}`);
      return res.status(404).json({ message: "Tag não cadastrada", uid });
    }

    // 3. Define o tipo da movimentação
    // Se o ESP não mandar tipo, assume 'leitura'. Se mandar, usa o que mandou.
    const tipoFinal = tipo || "leitura";

    // 4. Registra no banco
    await pool.query(
        "INSERT INTO movimentacoes (produto_id, tipo) VALUES ($1, $2)",
        [prod.rows[0].id, tipoFinal]
    );

    console.log(`[SUCESSO] ${prod.rows[0].nome} -> ${tipoFinal}`);
    res.status(201).json({ success: true });

  } catch (err) {
    console.error("ERRO NO POST /movements:", err);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
});

// --- CRUD DE PRODUTOS (Para o Front-end) ---

// Listar
app.get("/api/products", async (req, res) => {
  try {
    const r = await pool.query("SELECT * FROM produtos WHERE ativo = true ORDER BY nome ASC");
    res.json({ success: true, data: r.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Histórico
app.get("/api/movements", async (req, res) => {
  try {
    const r = await pool.query(`
      SELECT m.id, m.timestamp, m.tipo, p.nome, p.uid_etiqueta 
      FROM movimentacoes m 
      LEFT JOIN produtos p ON m.produto_id = p.id 
      ORDER BY m.timestamp DESC LIMIT 100
    `);
    res.json({ success: true, data: r.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Cadastrar
app.post("/api/products", async (req, res) => {
  const { nome, uid_etiqueta, descricao } = req.body;
  const uidFinal = uid_etiqueta.toUpperCase();

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // Cria o produto
    const r = await client.query(
        "INSERT INTO produtos (nome, uid_etiqueta, descricao) VALUES ($1, $2, $3) RETURNING *",
        [nome, uidFinal, descricao]
    );
    // Registra a entrada inicial automaticamente
    await client.query(
        "INSERT INTO movimentacoes (produto_id, tipo) VALUES ($1, 'entrada')",
        [r.rows[0].id]
    );
    await client.query("COMMIT");
    res.status(201).json({ success: true, data: r.rows[0] });
  } catch (err) {
    await client.query("ROLLBACK");
    // Código 23505 é erro de duplicidade (UID já existe)
    res.status(err.code === "23505" ? 409 : 500).json({ message: "Erro: Tag já cadastrada ou erro interno." });
  } finally {
    client.release();
  }
});

// Editar
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
      await pool.query("INSERT INTO movimentacoes (produto_id, tipo) VALUES ($1, 'editado')", [id]);
      res.json({ success: true, data: r.rows[0] });
    } else {
      res.status(404).json({ message: "Produto não encontrado" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Excluir (Soft Delete)
app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("INSERT INTO movimentacoes (produto_id, tipo) VALUES ($1, 'excluido')", [id]);
    // Define ativo=false e libera a etiqueta (NULL) para ser usada em outro produto se quiser
    const r = await pool.query("UPDATE produtos SET ativo = false, uid_etiqueta = NULL WHERE id=$1 RETURNING *", [id]);

    if (r.rows.length) res.json({ success: true });
    else res.status(404).json({ message: "Não encontrado" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- AUTH (Login Simples) ---
app.post("/auth/login", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const r = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    if (!r.rows.length || !(await bcrypt.compare(senha, r.rows[0].senha_hash)))
      return res.status(400).json({ message: "Email ou senha inválidos" });

    const token = jwt.sign({ id: r.rows[0].id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ success: true, token, user: { id: r.rows[0].id, nome: r.rows[0].nome } });
  } catch (err) {
    res.status(500).json({ message: "Erro no servidor" });
  }
});

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
    res.status(500).json({ message: "Erro ao cadastrar usuário." });
  }
});

app.listen(port, () => console.log(`>>> Servidor rodando na porta ${port}`));