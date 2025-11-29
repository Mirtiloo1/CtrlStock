import Navbar from "@/components/Navbar/Navbar";
import { api } from "@/services/api";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { styles } from "../../styles/_gerenciarStyles";

interface Produto {
  id: number;
  nome: string;
  uid_etiqueta: string;
  descricao?: string;
}

interface FormState {
  nome: string;
  uid: string;
  descricao: string;
}

const INITIAL_FORM_STATE: FormState = {
  nome: "",
  uid: "",
  descricao: "",
};

export default function Gerenciar() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);

  const [uiState, setUiState] = useState({
    loading: true,
    refreshing: false,
    salvando: false,
    modalVisible: false,
    scanModalVisible: false,
    isSearchFocused: false,
  });

  const [form, setForm] = useState<FormState>(INITIAL_FORM_STATE);
  const [produtoEmEdicao, setProdutoEmEdicao] = useState<Produto | null>(null);
  const [buscar, setBuscar] = useState("");

  const intervalScanRef = useRef<any>(null);

  const carregarProdutos = useCallback(async (silencioso = false) => {
    if (!silencioso) {
      setUiState((prev) => ({ ...prev, loading: true }));
    }

    try {
      const dados = await api.getProdutos();
      setProdutos(dados);
    } catch (error) {
      console.error(error);
    } finally {
      setUiState((prev) => ({ ...prev, loading: false, refreshing: false }));
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let intervalPolling: any;

      const checkAuthAndInit = async () => {
        try {
          const token = await AsyncStorage.getItem("@ctrlstock_token");
          if (!token) {
            setIsAuthenticated(false);
          } else {
            setIsAuthenticated(true);
            await carregarProdutos(false);

            intervalPolling = setInterval(() => {
              carregarProdutos(true);
            }, 5000);
          }
        } catch {
          setIsAuthenticated(false);
        }
      };

      checkAuthAndInit();

      return () => {
        if (intervalPolling) clearInterval(intervalPolling);
      };
    }, [carregarProdutos])
  );

  const handleRefresh = useCallback(() => {
    setUiState((prev) => ({ ...prev, refreshing: true }));
    carregarProdutos(true);
  }, [carregarProdutos]);

  const iniciarEscutaTag = () => {
    setUiState((prev) => ({ ...prev, scanModalVisible: true }));
    if (intervalScanRef.current) clearInterval(intervalScanRef.current);

    intervalScanRef.current = setInterval(async () => {
      const dadosBuffer = await api.getUltimaTagLida();

      if (dadosBuffer && dadosBuffer.uid) {
        const tagLida = dadosBuffer.uid;

        setForm((prev) => {
          if (prev.uid !== tagLida) {
            if (Platform.OS !== "web") Vibration.vibrate(100);
            pararEscutaTag();
            return { ...prev, uid: tagLida };
          }
          return prev;
        });
      }
    }, 1000);
  };

  const pararEscutaTag = () => {
    if (intervalScanRef.current) {
      clearInterval(intervalScanRef.current);
      intervalScanRef.current = null;
    }
    setUiState((prev) => ({ ...prev, scanModalVisible: false }));
  };

  const resetForm = () => {
    setForm(INITIAL_FORM_STATE);
    setProdutoEmEdicao(null);
  };

  const abrirModalCadastro = () => {
    resetForm();
    setUiState((prev) => ({ ...prev, modalVisible: true }));
  };

  const abrirModalEdicao = (produto: Produto) => {
    setProdutoEmEdicao(produto);
    setForm({
      nome: produto.nome,
      uid: produto.uid_etiqueta,
      descricao: produto.descricao || "",
    });
    setUiState((prev) => ({ ...prev, modalVisible: true }));
  };

  const fecharModal = () => {
    setUiState((prev) => ({ ...prev, modalVisible: false }));
    resetForm();
    pararEscutaTag();
  };

  const validarFormulario = () => {
    if (!form.nome.trim() || !form.uid.trim()) {
      Alert.alert("Atenção", "Nome e UID são obrigatórios.");
      return false;
    }

    const nomeDuplicado = produtos.find(
      (p) =>
        p.nome.toLowerCase() === form.nome.toLowerCase().trim() &&
        p.id !== produtoEmEdicao?.id
    );

    const uidDuplicada = produtos.find(
      (p) => p.uid_etiqueta === form.uid.trim() && p.id !== produtoEmEdicao?.id
    );

    if (nomeDuplicado) {
      Alert.alert("Erro", "Já existe um produto com este nome.");
      return false;
    }

    if (uidDuplicada) {
      Alert.alert(
        "Erro",
        `A etiqueta ${form.uid} já está em uso por "${uidDuplicada.nome}".`
      );
      return false;
    }

    return true;
  };

  const handleSalvar = async () => {
    if (!validarFormulario()) return;

    setUiState((prev) => ({ ...prev, salvando: true }));

    try {
      let resultado;
      if (produtoEmEdicao) {
        resultado = await api.atualizarProduto(
          produtoEmEdicao.id,
          form.nome,
          form.uid,
          form.descricao
        );
      } else {
        resultado = await api.cadastrarProduto(
          form.nome,
          form.uid,
          form.descricao
        );
      }

      if (resultado && (resultado.success || resultado.id || resultado.data)) {
        Alert.alert(
          "Sucesso",
          `Produto ${produtoEmEdicao ? "atualizado" : "cadastrado"}!`
        );
        fecharModal();
        carregarProdutos(true);
      } else {
        Alert.alert("Erro", resultado?.message || "Falha na operação.");
      }
    } catch {
      Alert.alert("Erro", "Falha de conexão.");
    } finally {
      setUiState((prev) => ({ ...prev, salvando: false }));
    }
  };
  const executarExclusao = useCallback(
    async (id: number) => {
      setUiState((prev) => ({ ...prev, loading: true }));
      try {
        const res = await api.deletarProduto(id);
        if (res.success) {
          setProdutos((prev) => prev.filter((p) => p.id !== id));
          if (Platform.OS === "web") alert("Produto excluído!");
          carregarProdutos(true);
        } else {
          Alert.alert("Erro", res.message || "Não foi possível excluir.");
        }
      } catch {
        Alert.alert("Erro", "Falha ao conectar com o servidor.");
      } finally {
        setUiState((prev) => ({ ...prev, loading: false }));
      }
    },
    [carregarProdutos]
  );

  const handleExcluir = useCallback(
    (produto: Produto) => {
      const confirmarExclusao = () => {
        executarExclusao(produto.id);
      };

      if (Platform.OS === "web") {
        if (window.confirm(`Remover "${produto.nome}"?`)) {
          confirmarExclusao();
        }
      } else {
        Alert.alert("Excluir Produto", `Deseja remover "${produto.nome}"?`, [
          { text: "Cancelar", style: "cancel" },
          { text: "Sim", style: "destructive", onPress: confirmarExclusao },
        ]);
      }
    },
    [executarExclusao]
  );

  const dadosFiltrados = useMemo(() => {
    const termo = buscar.toLowerCase().trim();
    if (!termo) return produtos;
    return produtos.filter(
      (p) =>
        p.nome.toLowerCase().includes(termo) ||
        p.uid_etiqueta.toLowerCase().includes(termo)
    );
  }, [produtos, buscar]);

  const renderItem = useCallback(
    ({ item }: { item: Produto }) => (
      <View style={styles.itemContainer}>
        <View style={styles.itemCard}>
          <View style={styles.containerTexts}>
            <Text style={styles.label}>Produto</Text>
            <Text style={styles.valor}>{item.nome}</Text>
            <Text style={styles.label}>UID Etiqueta</Text>
            <Text style={styles.valor}>{item.uid_etiqueta}</Text>
            {item.descricao ? (
              <>
                <Text style={styles.label}>Descrição</Text>
                <Text style={[styles.valor, { fontSize: 14, color: "#666" }]}>
                  {item.descricao}
                </Text>
              </>
            ) : null}
          </View>

          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.btnExcluir}
              activeOpacity={0.9}
              onPress={() => handleExcluir(item)}
            >
              <FontAwesome5 name="trash" size={14} color="white" />
              <Text style={styles.btnTexto}>Excluir</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnEditar}
              activeOpacity={0.9}
              onPress={() => abrirModalEdicao(item)}
            >
              <FontAwesome6 name="edit" size={14} color="white" />
              <Text style={styles.btnTexto}>Editar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ),
    [handleExcluir]
  );

  if (isAuthenticated === null || (uiState.loading && produtos.length === 0)) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (isAuthenticated === false) {
    return (
      <View style={styles.container}>
        <Navbar />
        <View style={styles.accessDeniedContainer}>
          <View style={styles.accessDeniedCard}>
            <FontAwesome6 name="lock" size={60} color="#999" />
            <Text style={styles.accessDeniedTitle}>Acesso Restrito</Text>
            <Text style={styles.accessDeniedText}>
              Você precisa estar logado para acessar esta tela.
            </Text>
            <TouchableOpacity
              style={styles.btnLogin}
              onPress={() => router.replace("/(tabs)/login")}
              activeOpacity={0.9}
            >
              <Text style={styles.btnLoginText}>Fazer Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Navbar />

      <View style={styles.contentContainer}>
        <View style={styles.containerTopo}>
          <Text style={styles.title}>GERENCIAMENTO</Text>
          <View style={styles.containerBuscar}>
            <TextInput
              value={buscar}
              placeholder="Buscar produto ou UID..."
              onChangeText={setBuscar}
              onFocus={() =>
                setUiState((prev) => ({ ...prev, isSearchFocused: true }))
              }
              onBlur={() =>
                setUiState((prev) => ({ ...prev, isSearchFocused: false }))
              }
              style={[
                styles.buscar,
                uiState.isSearchFocused && styles.buscarFocused,
              ]}
            />
            {buscar.length > 0 && (
              <TouchableOpacity
                style={styles.iconLimpar}
                onPress={() => setBuscar("")}
              >
                <FontAwesome name="times-circle" size={22} color="#999" />
              </TouchableOpacity>
            )}
            {!buscar && (
              <FontAwesome
                name="search"
                size={20}
                color="black"
                style={styles.iconBuscar}
              />
            )}
          </View>
        </View>

        <FlatList
          data={dadosFiltrados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum produto encontrado.</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 180 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={uiState.refreshing}
              onRefresh={handleRefresh}
            />
          }
        />
      </View>

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={abrirModalCadastro}
      >
        <FontAwesome6 name="plus" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={uiState.modalVisible}
        onRequestClose={fecharModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {produtoEmEdicao ? "Editar Produto" : "Novo Produto"}
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome do Produto *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Ex: Fonte 450w"
                value={form.nome}
                onChangeText={(text) =>
                  setForm((prev) => ({ ...prev, nome: text }))
                }
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>UID da Etiqueta (NFC) *</Text>
              <View style={styles.uidContainer}>
                <TextInput
                  style={[styles.modalInput, { flex: 1 }]}
                  placeholder="Toque no ícone ao lado..."
                  value={form.uid}
                  onChangeText={(text) =>
                    setForm((prev) => ({ ...prev, uid: text }))
                  }
                  autoCapitalize="none"
                  editable={true}
                />
                <TouchableOpacity
                  style={styles.btnNfcScan}
                  onPress={iniciarEscutaTag}
                >
                  <FontAwesome6 name="nfc-symbol" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Descrição (Opcional)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Detalhes do item..."
                value={form.descricao}
                onChangeText={(text) =>
                  setForm((prev) => ({ ...prev, descricao: text }))
                }
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.btnCancelar}
                onPress={fecharModal}
              >
                <Text style={styles.txtCancelar}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btnSalvar, uiState.salvando && { opacity: 0.7 }]}
                onPress={handleSalvar}
                disabled={uiState.salvando}
              >
                {uiState.salvando ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.txtSalvar}>Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={uiState.scanModalVisible}
        onRequestClose={pararEscutaTag}
      >
        <View style={styles.scanModalOverlay}>
          <View style={styles.scanModalCard}>
            <ActivityIndicator
              size="large"
              color="#0000ff"
              style={styles.scanActivity}
            />
            <FontAwesome6
              name="nfc-directional"
              size={50}
              color="#333"
              style={styles.scanIcon}
            />
            <Text style={styles.scanTextTitle}>Aguardando Tag...</Text>
            <Text style={styles.scanTextBody}>
              Aproxime o cartão ou chaveiro do leitor MFRC522 agora.
            </Text>

            <TouchableOpacity
              style={styles.btnScanCancel}
              onPress={pararEscutaTag}
            >
              <Text style={styles.txtScanCancel}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
