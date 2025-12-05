import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://ctrlstock-api.onrender.com";

export const api = {
  getProdutos: async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`);
      const json = await response.json();
      return json.data || [];
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      return [];
    }
  },

  getMovimentacoes: async () => {
    try {
      const response = await fetch(`${API_URL}/api/movements`);
      const json = await response.json();
      return json.data || [];
    } catch (error) {
      console.error("Erro ao buscar movimentações:", error);
      return [];
    }
  },

  // --- IOT & HARDWARE ---
  getUltimaTagLida: async () => {
    try {
      const response = await fetch(`${API_URL}/api/last-unknown`);
      const json = await response.json();
      return json; // Retorna { uid: "..." } ou { uid: null }
    } catch (error) {
      console.error("Erro ao ler tag do buffer:", error);
      return { uid: null };
    }
  },

  // --- OPERAÇÕES DE PRODUTO ---
  cadastrarProduto: async (
    nome: string,
    uid: string,
    descricao: string,
    imagem: string = ""
  ) => {
    try {
      const response = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, uid_etiqueta: uid, descricao, imagem }),
      });
      return await response.json();
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      return { success: false, message: "Erro de conexão." };
    }
  },

  atualizarProduto: async (
    id: number,
    nome: string,
    uid: string,
    descricao: string,
    imagem: string = ""
  ) => {
    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, uid_etiqueta: uid, descricao, imagem }),
      });
      return await response.json();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      return { success: false, message: "Erro de conexão." };
    }
  },

  deletarProduto: async (id: number) => {
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

  // === AUTENTICAÇÃO ===
  cadastrarUsuario: async (nome: string, email: string, senha: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: "Erro de conexão." };
    }
  },

  login: async (email: string, senha: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const json = await response.json();

      if (json.success && json.token) {
        await AsyncStorage.setItem("@ctrlstock_token", json.token);
        await AsyncStorage.setItem(
          "@ctrlstock_user",
          JSON.stringify(json.user)
        );
      }
      return json;
    } catch (error) {
      return { success: false, message: "Erro de conexão." };
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem("@ctrlstock_token");
    await AsyncStorage.removeItem("@ctrlstock_user");
  },

  // === STATUS DISPOSITIVO ===
  getDeviceStatus: async () => {
    try {
      const response = await fetch(`${API_URL}/api/device-status`);
      return await response.json();
    } catch (error) {
      return { success: false };
    }
  },
};
