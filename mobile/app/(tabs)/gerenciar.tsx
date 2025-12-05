import Navbar from "@/components/Navbar/Navbar";
import { api } from "@/services/api";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
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
  Image,
  ScrollView,
} from "react-native";
import { styles } from "../../styles/_gerenciarStyles";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/hooks/useAuth";
import * as ImagePicker from "expo-image-picker";

interface Produto {
  id: number;
  nome: string;
  uid_etiqueta: string;
  descricao?: string;
  imagem?: string;
}

interface FormState {
  nome: string;
  uid: string;
  descricao: string;
  imagem: string;
}

const INITIAL_FORM: FormState = {
  nome: "",
  uid: "",
  descricao: "",
  imagem: "",
};

const LoadingScreen = () => (
  <View
    style={[
      styles.container,
      { justifyContent: "center", alignItems: "center" },
    ]}
  >
    <ActivityIndicator size="large" color={Colors.primary} />
  </View>
);

const AuthRequiredScreen = ({ onLogin }: { onLogin: () => void }) => (
  <View style={styles.container}>
    <Navbar />
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <FontAwesome6
        name="lock"
        size={60}
        color="#999"
        style={{ marginBottom: 20 }}
      />
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#555",
          marginBottom: 10,
        }}
      >
        Acesso Restrito
      </Text>
      <Text style={{ color: "#777", textAlign: "center", marginBottom: 20 }}>
        Você precisa estar logado para acessar esta tela.
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: Colors.primary,
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderRadius: 8,
        }}
        onPress={onLogin}
        activeOpacity={0.9}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Fazer Login</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function Gerenciar() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [produtos, setProdutos] = useState<Produto[]>([]);

  const [uiState, setUiState] = useState({
    loading: true,
    refreshing: false,
    salvando: false,
    modalVisible: false,
    scanModalVisible: false,
    modalDetalhesVisible: false,
    isSearchFocused: false,
  });

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [produtoEmEdicao, setProdutoEmEdicao] = useState<Produto | null>(null);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(
    null
  );
  const [buscar, setBuscar] = useState("");

  const intervalScanRef = useRef<any>(null);

  const carregarProdutos = useCallback(async (silencioso = false) => {
    if (!silencioso) setUiState((p) => ({ ...p, loading: true }));

    try {
      const dados = await api.getProdutos();
      setProdutos(dados);
    } catch (error) {
      console.error(error);
    } finally {
      setUiState((p) => ({ ...p, loading: false, refreshing: false }));
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!isAuthenticated) return;

      carregarProdutos(false);
      const interval = setInterval(() => carregarProdutos(true), 5000);
      return () => clearInterval(interval);
    }, [isAuthenticated, carregarProdutos])
  );

  const handleRefresh = useCallback(() => {
    setUiState((p) => ({ ...p, refreshing: true }));
    carregarProdutos(true);
  }, [carregarProdutos]);

  const selecionarImagem = async (usarCamera: boolean) => {
    try {
      let result;

      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      };

      if (usarCamera) {
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync(options);
      } else {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        result = await ImagePicker.launchImageLibraryAsync(options);
      }

      if (!result.canceled && result.assets?.[0]?.base64) {
        const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;
        setForm((prev) => ({ ...prev, imagem: base64Img }));
      }
    } catch {
      Alert.alert("Erro", "Não foi possível carregar a imagem.");
    }
  };

  const mostrarOpcoesImagem = () => {
    Alert.alert("Foto do Produto", "Escolha uma opção", [
      { text: "Cancelar", style: "cancel" },
      { text: "Galeria", onPress: () => selecionarImagem(false) },
      { text: "Câmera", onPress: () => selecionarImagem(true) },
    ]);
  };

  const pararEscutaTag = useCallback(() => {
    if (intervalScanRef.current) {
      clearInterval(intervalScanRef.current);
      intervalScanRef.current = null;
    }
    setUiState((p) => ({ ...p, scanModalVisible: false }));
  }, []);

  const iniciarEscutaTag = useCallback(() => {
    setUiState((p) => ({ ...p, scanModalVisible: true }));
    if (intervalScanRef.current) clearInterval(intervalScanRef.current);

    intervalScanRef.current = setInterval(async () => {
      try {
        const dadosBuffer = await api.getUltimaTagLida();
        if (dadosBuffer?.uid) {
          setForm((prev) => {
            if (prev.uid !== dadosBuffer.uid) {
              if (Platform.OS !== "web") Vibration.vibrate(100);
              pararEscutaTag();
              return { ...prev, uid: dadosBuffer.uid };
            }
            return prev;
          });
        }
      } catch {
        // Erro silencioso ou log
      }
    }, 1000);
  }, [pararEscutaTag]);

  const resetForm = useCallback(() => {
    setForm(INITIAL_FORM);
    setProdutoEmEdicao(null);
  }, []);

  const abrirModalCadastro = useCallback(() => {
    resetForm();
    setUiState((p) => ({ ...p, modalVisible: true }));
  }, [resetForm]);

  const abrirModalEdicao = useCallback((produto: Produto) => {
    setProdutoEmEdicao(produto);
    setForm({
      nome: produto.nome,
      uid: produto.uid_etiqueta,
      descricao: produto.descricao || "",
      imagem: produto.imagem || "",
    });
    setUiState((p) => ({ ...p, modalVisible: true }));
  }, []);

  const abrirModalDetalhes = useCallback((produto: Produto) => {
    setProdutoSelecionado(produto);
    setUiState((p) => ({ ...p, modalDetalhesVisible: true }));
  }, []);

  const fecharModal = useCallback(() => {
    setUiState((p) => ({
      ...p,
      modalVisible: false,
      modalDetalhesVisible: false,
    }));
    resetForm();
    setProdutoSelecionado(null);
    pararEscutaTag();
  }, [resetForm, pararEscutaTag]);

  const validarFormulario = useCallback(() => {
    if (
      !form.nome.trim() ||
      !form.uid.trim() ||
      !form.descricao.trim() ||
      !form.imagem
    ) {
      Alert.alert(
        "Atenção",
        "Todos os campos (Imagem, Nome, UID, Descrição) são obrigatórios."
      );
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
  }, [form, produtos, produtoEmEdicao]);

  const handleSalvar = useCallback(async () => {
    if (!validarFormulario()) return;

    setUiState((p) => ({ ...p, salvando: true }));

    try {
      const resultado = produtoEmEdicao
        ? await api.atualizarProduto(
            produtoEmEdicao.id,
            form.nome,
            form.uid,
            form.descricao,
            form.imagem
          )
        : await api.cadastrarProduto(
            form.nome,
            form.uid,
            form.descricao,
            form.imagem
          );

      if (resultado?.success || resultado?.id || resultado?.data) {
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
      setUiState((p) => ({ ...p, salvando: false }));
    }
  }, [validarFormulario, form, produtoEmEdicao, fecharModal, carregarProdutos]);

  const handleExcluir = useCallback(
    (produto: Produto) => {
      const executarExclusao = async () => {
        setUiState((p) => ({ ...p, loading: true }));
        try {
          const res = await api.deletarProduto(produto.id);
          if (res.success) {
            setProdutos((p) => p.filter((item) => item.id !== produto.id));
            if (Platform.OS === "web") alert("Produto excluído!");
            carregarProdutos(true);
          } else {
            Alert.alert("Erro", res.message || "Não foi possível excluir.");
          }
        } catch {
          Alert.alert("Erro", "Falha ao conectar com o servidor.");
        } finally {
          setUiState((p) => ({ ...p, loading: false }));
        }
      };

      if (Platform.OS === "web") {
        if (window.confirm(`Remover "${produto.nome}"?`)) executarExclusao();
      } else {
        Alert.alert("Excluir Produto", `Deseja remover "${produto.nome}"?`, [
          { text: "Cancelar", style: "cancel" },
          { text: "Sim", style: "destructive", onPress: executarExclusao },
        ]);
      }
    },
    [carregarProdutos]
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
          <View style={styles.itemHeader}>
            <View style={styles.itemImageContainer}>
              {item.imagem ? (
                <Image
                  source={{ uri: item.imagem }}
                  style={styles.itemImage}
                  resizeMode="cover"
                />
              ) : (
                <FontAwesome6 name="image" size={20} color="#ccc" />
              )}
            </View>

            <View style={styles.containerTexts}>
              <Text style={styles.label}>Produto</Text>
              <Text style={styles.valor}>{item.nome}</Text>
              <Text style={styles.label}>UID</Text>
              <Text style={styles.valor}>{item.uid_etiqueta}</Text>
            </View>
          </View>

          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={[styles.btnEditar, styles.btnVer]}
              activeOpacity={0.9}
              onPress={() => abrirModalDetalhes(item)}
            >
              <FontAwesome6 name="eye" size={14} color="white" />
              <Text style={styles.btnTexto}>Ver</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnEditar}
              activeOpacity={0.9}
              onPress={() => abrirModalEdicao(item)}
            >
              <FontAwesome6 name="edit" size={14} color="white" />
              <Text style={styles.btnTexto}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnExcluir}
              activeOpacity={0.9}
              onPress={() => handleExcluir(item)}
            >
              <FontAwesome5 name="trash" size={14} color="white" />
              <Text style={styles.btnTexto}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ),
    [handleExcluir, abrirModalEdicao, abrirModalDetalhes]
  );

  if (isAuthenticated === null || (uiState.loading && produtos.length === 0)) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return (
      <AuthRequiredScreen onLogin={() => router.replace("/(auth)/login")} />
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
                setUiState((p) => ({ ...p, isSearchFocused: true }))
              }
              onBlur={() =>
                setUiState((p) => ({ ...p, isSearchFocused: false }))
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

      {/* Modal Cadastro/Edição */}
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

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.imagePickerContainer}>
                <TouchableOpacity
                  onPress={mostrarOpcoesImagem}
                  style={styles.imagePreview}
                >
                  {form.imagem ? (
                    <Image
                      source={{ uri: form.imagem }}
                      style={styles.imageFull}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={{ alignItems: "center" }}>
                      <FontAwesome6 name="camera" size={30} color="#999" />
                      <Text style={styles.imagePlaceholderText}>Foto</Text>
                    </View>
                  )}
                </TouchableOpacity>
                <Text
                  style={styles.imageChangeText}
                  onPress={mostrarOpcoesImagem}
                >
                  {form.imagem ? "Alterar Foto" : "Adicionar Foto"}
                </Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nome do Produto *</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Ex: Fonte 450w"
                  value={form.nome}
                  onChangeText={(text) =>
                    setForm((p) => ({ ...p, nome: text }))
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
                      setForm((p) => ({ ...p, uid: text }))
                    }
                    autoCapitalize="none"
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
                <Text style={styles.inputLabel}>Descrição *</Text>
                <TextInput
                  style={[styles.modalInput, styles.inputMultiline]}
                  placeholder="Detalhes do item..."
                  value={form.descricao}
                  onChangeText={(text) =>
                    setForm((p) => ({ ...p, descricao: text }))
                  }
                  multiline
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
                  style={[
                    styles.btnSalvar,
                    uiState.salvando && { opacity: 0.7 },
                  ]}
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
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={uiState.modalDetalhesVisible}
        onRequestClose={fecharModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: "80%" }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, styles.modalTitleNoMargin]}>
                Detalhes do Produto
              </Text>
              <TouchableOpacity onPress={fecharModal}>
                <FontAwesome6 name="xmark" size={24} color="#999" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.detailImageContainer}>
                {produtoSelecionado?.imagem ? (
                  <Image
                    source={{ uri: produtoSelecionado.imagem }}
                    style={styles.imageFull}
                    resizeMode="contain"
                  />
                ) : (
                  <FontAwesome6 name="image" size={50} color="#ccc" />
                )}
              </View>

              <View style={styles.detailInfoBox}>
                <Text style={styles.inputLabel}>Nome</Text>
                <Text style={styles.detailValueTitle}>
                  {produtoSelecionado?.nome}
                </Text>
              </View>

              <View style={styles.detailInfoBox}>
                <Text style={styles.inputLabel}>UID Etiqueta</Text>
                <Text style={styles.detailValueMono}>
                  {produtoSelecionado?.uid_etiqueta}
                </Text>
              </View>

              <View style={[styles.detailInfoBox, { marginBottom: 20 }]}>
                <Text style={styles.inputLabel}>Descrição</Text>
                <Text style={styles.detailValueText}>
                  {produtoSelecionado?.descricao || "Sem descrição"}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.btnEditLarge}
                onPress={() => {
                  if (produtoSelecionado) {
                    fecharModal();
                    setTimeout(() => {
                      abrirModalEdicao(produtoSelecionado);
                    }, 300);
                  }
                }}
              >
                <View style={styles.rowCenter}>
                  <FontAwesome6 name="edit" size={16} color="white" />
                  <Text style={styles.btnTextLarge}>Editar Produto</Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
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
