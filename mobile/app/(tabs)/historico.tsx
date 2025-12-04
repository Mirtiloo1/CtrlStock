import Navbar from "@/components/Navbar/Navbar";
import { api } from "@/services/api";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Ionicons } from "@expo/vector-icons";
import { File, Paths } from "expo-file-system";
import { useFocusEffect, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../../styles/_historicoStyles";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/hooks/useAuth";

const STATUS_CONFIG = {
  entrada: {
    bg: "#ecfdf5",
    text: "#15803d",
    border: "#bbf7d0",
    label: "Entrada",
    icon: "arrow-up-circle",
  },
  saida: {
    bg: "#fef2f2",
    text: "#b91c1c",
    border: "#fecaca",
    label: "Saída",
    icon: "arrow-down-circle",
  },
  leitura: {
    bg: "#eff6ff",
    text: "#1d4ed8",
    border: "#bfdbfe",
    label: "Movimento",
    icon: "swap-horizontal",
  },
  movimentacao: {
    bg: "#eff6ff",
    text: "#1d4ed8",
    border: "#bfdbfe",
    label: "Movimento",
    icon: "swap-horizontal",
  },
  editado: {
    bg: "#fffbeb",
    text: "#b45309",
    border: "#fde68a",
    label: "Editado",
    icon: "create",
  },
  excluido: {
    bg: "#f9fafb",
    text: "#374151",
    border: "#e5e7eb",
    label: "Excluído",
    icon: "trash",
  },
  default: {
    bg: "#f8fafc",
    text: "#64748b",
    border: "#e2e8f0",
    label: "Outro",
    icon: "help-circle",
  },
} as const;

const getStatusConfig = (tipo: string) => {
  const key = (tipo || "").toLowerCase();
  return (
    STATUS_CONFIG[key as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.default
  );
};

interface LogItem {
  id: string;
  produto: string;
  data: string;
  hora: string;
  acao: string;
}

const formatarDataHora = (isoString: string) => {
  if (!isoString) return { data: "--/--/--", hora: "--:--" };
  const dataObj = new Date(isoString);
  return {
    data: dataObj.toLocaleDateString("pt-BR"),
    hora: dataObj.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
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

export default function Historico() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [logs, setLogs] = useState<LogItem[]>([]);

  const [uiState, setUiState] = useState({
    loading: true,
    refreshing: false,
    isSearchFocused: false,
  });

  const [buscar, setBuscar] = useState("");

  const carregarDados = useCallback(async (silencioso = false) => {
    if (!silencioso) setUiState((p) => ({ ...p, loading: true }));

    try {
      const movimentosData = await api.getMovimentacoes();

      const dadosFormatados: LogItem[] = movimentosData
        .map((item: any) => {
          const { data, hora } = formatarDataHora(item.timestamp);
          return {
            id: item.id.toString(),
            produto: item.nome || "Produto Deletado",
            data,
            hora,
            acao: item.tipo,
          };
        })
        .sort((a: LogItem, b: LogItem) => Number(b.id) - Number(a.id));

      setLogs(dadosFormatados);
    } catch (error) {
      console.error("Erro ao processar dados:", error);
    } finally {
      setUiState((p) => ({ ...p, loading: false, refreshing: false }));
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!isAuthenticated) return;

      carregarDados(false);
      const interval = setInterval(() => carregarDados(true), 3000);
      return () => clearInterval(interval);
    }, [isAuthenticated, carregarDados])
  );

  const handleRefresh = useCallback(() => {
    setUiState((p) => ({ ...p, refreshing: true }));
    carregarDados(true);
  }, [carregarDados]);

  const dadosFiltrados = useMemo(() => {
    const termo = buscar.toLowerCase().trim();
    if (!termo) return logs;

    return logs.filter((item) => {
      const nomeProduto = item.produto?.toLowerCase() || "";
      const idMovimento = item.id?.toLowerCase() || "";
      return nomeProduto.includes(termo) || idMovimento.includes(termo);
    });
  }, [logs, buscar]);

  const exportarCSV = useCallback(async () => {
    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert("Erro", "Compartilhamento não suportado neste dispositivo.");
      return;
    }

    if (dadosFiltrados.length === 0) {
      Alert.alert("Atenção", "Nenhum dado para exportar.");
      return;
    }

    try {
      const cabecalho = "ID;Produto;Data;Hora;Acao\n";
      const linhas = dadosFiltrados
        .map((item) => {
          const config = getStatusConfig(item.acao);
          return `${item.id};${item.produto};="${item.data}";="${item.hora}";${config.label}`;
        })
        .join("\n");

      const csvContent = "\uFEFF" + cabecalho + linhas;
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .slice(0, -5);
      const nomeArquivo = `historico_${timestamp}.csv`;
      const cacheDir = Paths.cache || "";
      const fileRef = new File(cacheDir, nomeArquivo);

      await fileRef.create();
      await fileRef.write(csvContent);
      await Sharing.shareAsync(fileRef.uri, {
        mimeType: "text/csv",
        dialogTitle: "Salvar Histórico CSV",
        UTI: "public.comma-separated-values-text",
      });
    } catch (error) {
      console.error("Erro ao exportar CSV:", error);
      Alert.alert("Erro", "Falha ao gerar arquivo CSV.");
    }
  }, [dadosFiltrados]);

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<LogItem>) => {
      const status = getStatusConfig(item.acao);

      return (
        <View style={[styles.linha, index % 2 === 1 && styles.linhaAlt]}>
          <Text style={[styles.celulaData, styles.colID]} numberOfLines={1}>
            {item.id}
          </Text>
          <Text
            style={[styles.celulaData, styles.colProduto]}
            numberOfLines={1}
          >
            {item.produto}
          </Text>
          <View style={[styles.celula, styles.colAcao]}>
            <View
              style={[
                styles.badgeContainer,
                { backgroundColor: status.bg, borderColor: status.border },
              ]}
            >
              <Ionicons
                name={status.icon as any}
                size={12}
                color={status.text}
              />
              <Text style={[styles.badgeText, { color: status.text }]}>
                {status.label}
              </Text>
            </View>
          </View>
          <Text style={[styles.celulaData, styles.colData]}>{item.data}</Text>
          <Text style={[styles.celulaData, styles.colHora]}>{item.hora}</Text>
        </View>
      );
    },
    []
  );

  if (isAuthenticated === null || (uiState.loading && logs.length === 0)) {
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
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={uiState.refreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        <View style={styles.containerTopo}>
          <Text style={styles.title}>HISTÓRICO DE MOVIMENTAÇÕES</Text>

          <View style={styles.containerBuscar}>
            <TextInput
              value={buscar}
              placeholder="Buscar por produto ou ID..."
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

          <TouchableOpacity
            style={styles.botaoExportar}
            onPress={exportarCSV}
            activeOpacity={0.9}
          >
            <Text style={styles.textoBotao}>Exportar CSV</Text>
            <FontAwesome6 name="file-csv" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.tabelaContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.tabela}>
              <View style={styles.header}>
                <Text style={[styles.celula, styles.colID, styles.headerText]}>
                  ID
                </Text>
                <Text
                  style={[styles.celula, styles.colProduto, styles.headerText]}
                >
                  Produto
                </Text>
                <Text
                  style={[styles.celula, styles.colAcao, styles.headerText]}
                >
                  Ação
                </Text>
                <Text
                  style={[styles.celula, styles.colData, styles.headerText]}
                >
                  Data
                </Text>
                <Text
                  style={[styles.celula, styles.colHora, styles.headerText]}
                >
                  Hora
                </Text>
              </View>

              <FlatList
                data={dadosFiltrados}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListEmptyComponent={
                  <View style={styles.listaVaziaContainer}>
                    <Text style={styles.listaVaziaTexto}>
                      Nenhum registro encontrado.
                    </Text>
                    <Text style={styles.listaVaziaSubtexto}>
                      Arraste para baixo para atualizar.
                    </Text>
                  </View>
                }
              />
            </View>
          </ScrollView>

          <View style={styles.deslizar}>
            <Text style={styles.textDeslizar}>
              ← Deslize para ver mais colunas →
            </Text>
          </View>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}
