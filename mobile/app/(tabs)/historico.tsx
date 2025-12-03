import Navbar from "@/components/Navbar/Navbar";
import { api } from "@/services/api";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Ionicons } from "@expo/vector-icons"; 
import AsyncStorage from "@react-native-async-storage/async-storage";
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

// --- CÉREBRO VISUAL (Configuração de Cores e Texto) ---
const getStatusConfig = (tipo: string) => {
  const t = tipo ? tipo.toLowerCase() : '';
  
  switch (t) {
    case 'entrada':
      return { color: '#00B37E', label: 'Entrada', icon: 'arrow-down-circle' }; // Verde
    case 'saida':
      return { color: '#F75A68', label: 'Saída', icon: 'arrow-up-circle' }; // Vermelho
    case 'leitura':        // O Banco grava 'leitura'
    case 'movimentacao':   // Backend manda isso
      return { color: '#8D8D99', label: 'Movimentação', icon: 'swap-horizontal' }; // Cinza (Mostra Movimentação)
    case 'editado':
      return { color: '#FBA94C', label: 'Editado', icon: 'create' }; // Laranja
    case 'excluido':
      return { color: '#000000', label: 'Excluído', icon: 'trash' }; // Preto (SEM NEGRITO)
    default:
      return { color: '#C4C4CC', label: tipo || 'Outro', icon: 'help-circle' };
  }
};

interface LogItem {
  id: string;
  produto: string;
  data: string;
  hora: string;
  acao: string;
  uid?: string;
}

export default function Historico() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [logs, setLogs] = useState<LogItem[]>([]);
  
  const [uiState, setUiState] = useState({
    loading: true,
    refreshing: false,
    isSearchFocused: false,
  });

  const [buscar, setBuscar] = useState("");

  const formatarDataHora = (isoString: string) => {
    if (!isoString) return { data: "--/--/--", hora: "--:--" };
    const dataObj = new Date(isoString);
    return {
      data: dataObj.toLocaleDateString("pt-BR"),
      hora: dataObj.toLocaleTimeString("pt-BR"),
    };
  };

  const carregarDados = useCallback(async (silencioso = false) => {
    if (!silencioso) {
      setUiState((prev) => ({ ...prev, loading: true }));
    }

    try {
      const dadosBrutos: any[] = await api.getMovimentacoes();

      const dadosFormatados: LogItem[] = dadosBrutos.map((item: any) => {
        const { data, hora } = formatarDataHora(item.timestamp);
        return {
          id: item.id.toString(),
          produto: item.produto_nome || "Produto Deletado",
          data: data,
          hora: hora,
          acao: item.tipo, 
          uid: item.uid_etiqueta
        };
      });

      setLogs(dadosFormatados);
    } catch (error) {
      console.error("Erro ao processar dados:", error);
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
            await carregarDados(false);
            
            intervalPolling = setInterval(() => {
              carregarDados(true);
            }, 3000); // Atualiza a cada 3s para ficar mais rápido
          }
        } catch {
          setIsAuthenticated(false);
        }
      };

      checkAuthAndInit();

      return () => {
        if (intervalPolling) clearInterval(intervalPolling);
      };
    }, [carregarDados])
  );

  const handleRefresh = useCallback(() => {
    setUiState((prev) => ({ ...prev, refreshing: true }));
    carregarDados(true);
  }, [carregarDados]);

  const dadosFiltrados = useMemo(() => {
    const buscaNormalizada = buscar.toLowerCase().trim();
    if (buscaNormalizada === "") return logs;

    return logs.filter((item) => {
      const nomeProduto = item.produto ? item.produto.toLowerCase() : "";
      const idProduto = item.id ? item.id.toString().toLowerCase() : "";
      return (
        nomeProduto.includes(buscaNormalizada) ||
        idProduto.includes(buscaNormalizada)
      );
    });
  }, [logs, buscar]);

  const exportarCSV = useCallback(async () => {
    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert("Erro", "Compartilhamento não suportado neste dispositivo.");
      return;
    }
    try {
      if (dadosFiltrados.length === 0) {
        Alert.alert("Atenção", "Nenhum dado para exportar.");
        return;
      }

      const cabecalho = "ID;Produto;UID;Data;Hora;Acao\n";
      const linhas = dadosFiltrados
        .map(
          (item) => {
            const config = getStatusConfig(item.acao);
            return `${item.id};${item.produto};${item.uid || ''};="${item.data}";="${item.hora}";${config.label}`;
          }
        )
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

  const renderItem = useCallback(({ item, index }: ListRenderItemInfo<LogItem>) => {
    const statusConfig = getStatusConfig(item.acao);
    
    return (
      <View style={[styles.linha, index % 2 === 1 && styles.linhaAlt]}>
        <Text style={[styles.celulaData, styles.colID]}>{item.id}</Text>
        <Text style={[styles.celulaData, styles.colProduto]} numberOfLines={1}>
          {item.produto}
        </Text>
        <Text style={[styles.celulaData, styles.colData]}>{item.data}</Text>
        <Text style={[styles.celulaData, styles.colHora]}>{item.hora}</Text>
        
        {/* Célula de Ação Personalizada */}
        <View style={[styles.celulaData, styles.colAcao, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}>
           <Ionicons 
              name={statusConfig.icon as any} 
              size={14} 
              color={statusConfig.color} 
              style={{ marginRight: 4 }}
           />
           <Text style={{ 
             color: statusConfig.color, 
             fontWeight: 'bold',
             fontSize: 12,
             textTransform: 'uppercase'
           }}>
             {statusConfig.label}
           </Text>
        </View>
      </View>
    );
  }, []);

  if (isAuthenticated === null || (uiState.loading && logs.length === 0)) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (isAuthenticated === false) {
    return (
      <View style={styles.container}>
        <Navbar />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
          <FontAwesome6 name="lock" size={60} color="#999" style={{ marginBottom: 20 }} />
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#555", marginBottom: 10 }}>
            Acesso Restrito
          </Text>
          <Text style={{ color: "#777", textAlign: "center", marginBottom: 20 }}>
            Você precisa estar logado para acessar esta tela.
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: "#000", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 }}
            onPress={() => router.replace("/(tabs)/login")}
            activeOpacity={0.9}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Fazer Login</Text>
          </TouchableOpacity>
        </View>
      </View>
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
          <RefreshControl refreshing={uiState.refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.containerTopo}>
          <Text style={styles.title}>HISTÓRICO DE MOVIMENTAÇÕES</Text>

          <View style={styles.containerBuscar}>
            <TextInput
              value={buscar}
              placeholder="Buscar produtos..."
              onChangeText={setBuscar}
              onFocus={() => setUiState((prev) => ({ ...prev, isSearchFocused: true }))}
              onBlur={() => setUiState((prev) => ({ ...prev, isSearchFocused: false }))}
              style={[styles.buscar, uiState.isSearchFocused && styles.buscarFocused]}
            />
            {buscar.length > 0 && (
              <TouchableOpacity style={styles.iconLimpar} onPress={() => setBuscar("")}>
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
                <Text style={[styles.celula, styles.colProduto, styles.headerText]}>
                  Produto
                </Text>
                <Text style={[styles.celula, styles.colData, styles.headerText]}>
                  Data
                </Text>
                <Text style={[styles.celula, styles.colHora, styles.headerText]}>
                  Hora
                </Text>
                <Text style={[styles.celula, styles.colAcao, styles.headerText]}>
                  Ação
                </Text>
              </View>

              <FlatList
                data={dadosFiltrados}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListEmptyComponent={
                  <View style={styles.listaVaziaContainer}>
                    <Text style={styles.listaVaziaTexto}>Nenhum registro encontrado.</Text>
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