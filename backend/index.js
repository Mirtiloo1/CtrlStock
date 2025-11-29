const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config();

// Bibliotecas de Autenticação
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "senha_secreta_super_segura";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- CONEXÃO COM O BANCO DE DADOS ---
const isProduction = !!process.env.DATABASE_URL;
const pool = new Pool({
  connectionString:
      process.env.DATABASE_URL ||
      "postgresql://postgres:Cleison23!08!@localhost:5432/ctrlstock_db",
  ...(isProduction && { ssl: { rejectUnauthorized: false } }),
});

// --- BUFFER DE MEMÓRIA (Para comunicação ESP32 -> App) ---
let lastTagBuffer = { uid: null, timestamp: null };

// Rota de Teste Simples
app.get("/test-db", async (req, res) => {
  try {
    const r = await pool.query("SELECT NOW()");
    res.json({ success: true, dbTime: r.rows[0].now });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ====================== AUTENTICAÇÃO ====================== */

// Cadastro de Usuário (App)
app.post("/auth/register", async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha)
    return res.status(400).json({ success: false, message: "Preencha todos os campos." });

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(senha, salt);

    const r = await pool.query(
        "INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING id, nome, email",
        [nome, email, hash]
    );
    res.status(201).json({ success: true, user: r.rows[0] });
  } catch (err) {
    if (err.code === "23505")
      return res.status(400).json({ success: false, message: "Email já cadastrado." });
    res.status(500).json({ success: false, message: "Erro no servidor." });
  }
});

// Login de Usuário
app.post("/auth/login", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const r = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    const user = r.rows[0];

    if (!user) return res.status(400).json({ success: false, message: "Email ou senha incorretos." });

    const senhaCorreta = await bcrypt.compare(senha, user.senha_hash);
    if (!senhaCorreta) return res.status(400).json({ success: false, message: "Email ou senha incorretos." });

    const token = jwt.sign({ id: user.id, nome: user.nome }, JWT_SECRET, { expiresIn: "30d" });

    res.json({
      success: true,
      token,
      user: { id: user.id, nome: user.nome, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erro no login." });
  }
});

/* ====================== PRODUTOS (CRUD) ====================== */

// Listar Produtos (Apenas Ativos)
app.get("/api/products", async (req, res) => {
  try {
    const r = await pool.query("SELECT * FROM produtos WHERE ativo = true ORDER BY nome ASC");
    res.json({ success: true, data: r.rows });
  } catch {
    res.status(500).json({ success: false, message: "Erro ao buscar produtos" });
  }
});

// Cadastrar Produto
app.post("/api/products", async (req, res) => {
  const { nome, uid_etiqueta, descricao } = req.body;

  if (!nome || !uid_etiqueta)
    return res.status(400).json({ success: false, message: "Nome e UID são obrigatórios." });

  try {
    // Insere como ativo=true por padrão
    const r = await pool.query(
        `INSERT INTO produtos (nome, uid_etiqueta, descricao, ativo) VALUES ($1, $2, $3, true) RETURNING *`,
        [nome, uid_etiqueta, descricao || null]
    );
    res.status(201).json({ success: true, data: r.rows[0] });
  } catch (err) {
    if (err.code === "23505")
      return res.status(409).json({ success: false, message: "Esta etiqueta (UID) já está em uso." });
    res.status(500).json({ success: false, message: err.message });
  }
});

// Atualizar Produto
app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, uid_etiqueta, descricao } = req.body;
  try {
    const r = await pool.query(
        `UPDATE produtos SET nome=$1, uid_etiqueta=$2, descricao=$3 WHERE id=$4 RETURNING *`,
        [nome, uid_etiqueta, descricao, id]
    );
    if (!r.rows.length) return res.status(404).json({ success: false, message: "Produto não encontrado." });
    res.json({ success: true, data: r.rows[0] });
  } catch {
    res.status(500).json({ success: false, message: "Erro ao atualizar." });
  }
});

// Deletar Produto (Soft Delete - Libera a Tag)
app.delete("/api/products/:id", async (req, res) => {
  try {
    // Marca como inativo e remove o UID para que a etiqueta possa ser usada em outro produto
    const r = await pool.query(
        "UPDATE produtos SET ativo = false, uid_etiqueta = NULL WHERE id=$1 RETURNING *",
        [req.params.id]
    );
    if (!r.rows.length) return res.status(404).json({ success: false, message: "Produto não encontrado." });
    res.json({ success: true, message: "Produto removido." });
  } catch {
    res.status(500).json({ success: false, message: "Erro ao deletar." });
  }
});

/* ====================== MOVIMENTAÇÕES & INTEGRAÇÃO ESP32 ====================== */

// Rota que o APP chama para pegar a tag lida (com Validade de 5s)
app.get("/api/last-tag", (req, res) => {
  if (!lastTagBuffer.uid || !lastTagBuffer.timestamp) {
    return res.json({ uid: null });
  }

  const agora = new Date();
  const horarioTag = new Date(lastTagBuffer.timestamp);
  const diferencaSegundos = (agora - horarioTag) / 1000;

  // Se a leitura tem mais de 5 segundos, considera expirada (evita loop e fantasmas)
  if (diferencaSegundos > 5) {
    lastTagBuffer = { uid: null, timestamp: null };
    return res.json({ uid: null });
  }

  res.json(lastTagBuffer);
});

// Histórico de Movimentações
app.get("/api/movements", async (req, res) => {
  try {
    const r = await pool.query(`
      SELECT mov.id, mov.timestamp, mov.tipo, prod.nome AS produto_nome
      FROM movimentacoes mov
      JOIN produtos prod ON mov.produto_id = prod.id
      ORDER BY mov.timestamp DESC LIMIT 50
    `);
    res.json({ success: true, data: r.rows });
  } catch {
    res.status(500).json({ success: false, message: "Erro no histórico." });
  }
});

// Rota que o ESP32 chama (Entrada vs Saída)
app.post("/api/movements", async (req, res) => {
  const { uid, tipo } = req.body; // 'entrada' ou 'saida'

  if (!uid) return res.status(400).json({ success: false, message: "UID obrigatória." });

  // Salva no Buffer IMEDIATAMENTE (
  lastTagBuffer = { uid, timestamp: new Date() };
  console.log(`>>> ESP32 Leu: ${uid} | Modo: ${tipo || 'desconhecido'}`);

  try {
    // Verifica se o produto existe e está ATIVO
    const prod = await pool.query("SELECT id FROM produtos WHERE uid_etiqueta=$1 AND ativo=true", [uid]);

    // roduto não encontrado
    if (!prod.rows.length) {
      // Retorna 404 para o ESP32 dar erro visual, mas o buffer já salvou para cadastro.
      return res.status(404).json({ success: false, message: "UID desconhecida." });
    }

    const produtoId = prod.rows[0].id;

    //  Modo SAÍDA Caixa - Dar baixa
    if (tipo === 'saida') {
      // Registra saída no histórico
      await pool.query("INSERT INTO movimentacoes (produto_id, tipo) VALUES ($1, 'saida')", [produtoId]);

      // Remove do estoque Soft Delete
      await pool.query("UPDATE produtos SET ativo = false, uid_etiqueta = NULL WHERE id=$1", [produtoId]);

      return res.status(200).json({ success: true, message: "Saída registrada e produto baixado." });
    }

    // Cenario C: Modo ENTRADA (Padrão - Apenas registra leitura)
    await pool.query("INSERT INTO movimentacoes (produto_id, tipo) VALUES ($1, 'entrada')", [produtoId]);
    res.status(201).json({ success: true, message: "Leitura registrada." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erro interno." });
  }
});

app.listen(port, () => {
  console.log(`>>> Servidor rodando na porta ${port}`);
});