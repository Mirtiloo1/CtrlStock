const API_URL = "https://ctrlstock-api.onrender.com";

export const api = {
  // ==================== AUTENTICAÇÃO ====================

  async cadastrarUsuario(nome, email, senha) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });
      return await response.json();
    } catch (error) {
      console.error("Erro no cadastro:", error);
      return { success: false, message: "Erro de conexão." };
    }
  },

  async login(email, senha) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const json = await response.json();

      if (json.success && json.token) {
        localStorage.setItem("@ctrlstock_token", json.token);
        localStorage.setItem("@ctrlstock_user", JSON.stringify(json.user));
      }

      return json;
    } catch (error) {
      console.error("Erro no login:", error);
      return { success: false, message: "Erro de conexão." };
    }
  },

  logout() {
    localStorage.removeItem("@ctrlstock_token");
    localStorage.removeItem("@ctrlstock_user");
  },

  getUser() {
    const userStr = localStorage.getItem("@ctrlstock_user");
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken() {
    return localStorage.getItem("@ctrlstock_token");
  },

  // ==================== PRODUTOS ====================

  async getProdutos() {
    try {
      const response = await fetch(`${API_URL}/api/products`);
      const json = await response.json();
      return json.data || [];
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      return [];
    }
  },

  async cadastrarProduto(nome, uid, descricao) {
    try {
      const response = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, uid_etiqueta: uid, descricao }),
      });
      return await response.json();
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      return { success: false, message: "Erro de conexão." };
    }
  },

  async atualizarProduto(id, nome, uid, descricao) {
    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, uid_etiqueta: uid, descricao }),
      });
      return await response.json();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      return { success: false, message: "Erro de conexão." };
    }
  },

  async deletarProduto(id) {
    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        try {
          return await response.json();
        } catch {
          return { success: true };
        }
      }
      return { success: false, message: "Falha ao deletar." };
    } catch (error) {
      console.error("Erro ao deletar:", error);
      return { success: false, message: "Erro de conexão." };
    }
  },

  // ==================== MOVIMENTAÇÕES ====================

  async getMovimentacoes() {
    try {
      const response = await fetch(`${API_URL}/api/movements`);
      const json = await response.json();
      return json.data || [];
    } catch (error) {
      console.error("Erro ao buscar movimentações:", error);
      return [];
    }
  },

  async getUltimaTagLida() {
    try {
      const response = await fetch(`${API_URL}/api/last-tag`);
      const json = await response.json();
      return json;
    } catch (error) {
      console.error("Erro ao ler tag:", error);
      return { uid: null };
    }
  },
};
