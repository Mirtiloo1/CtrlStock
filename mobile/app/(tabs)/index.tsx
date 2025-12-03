import { useRouter, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { Colors } from "@/constants/Colors";
import Navbar from "../../components/Navbar/Navbar";
import { styles as indexStyles } from "../../styles/_IndexStyles";

import { api } from "@/services/api";

interface LogItemProps {
  type: string; // Agora aceita qualquer tipo de ação
  item: string;
  quantity: number;
  timestamp: string;
}

const getLogStyle = (type: string) => {
  const tipoNormalizado = type ? type.toLowerCase() : "entrada";

  switch (tipoNormalizado) {
    case "entrada":
      return {
        bg: "#ecfdf5", // green-50
        iconColor: "#16a34a", // green-600
        borderColor: "#bbf7d0", // green-200
        badgeBg: "#ecfdf5",
        badgeText: "#15803d", // green-700
        badgeBorder: "#bbf7d0",
        iconName: "arrow-up",
        label: "ENTRADA",
      };
    case "saida":
      return {
        bg: "#fef2f2", // red-50
        iconColor: "#dc2626", // red-600
        borderColor: "#fecaca", // red-200
        badgeBg: "#fef2f2",
        badgeText: "#b91c1c", // red-700
        badgeBorder: "#fecaca",
        iconName: "arrow-down",
        label: "SAÍDA",
      };
    case "leitura":
    case "movimentacao":
      return {
        bg: "#eff6ff", // blue-50
        iconColor: "#1d4ed8", // blue-700
        borderColor: "#bfdbfe", // blue-200
        badgeBg: "#eff6ff",
        badgeText: "#1d4ed8",
        badgeBorder: "#bfdbfe",
        iconName: "exchange",
        label: "MOVIMENTAÇÃO",
      };
    case "editado":
      return {
        bg: "#fffbeb", // amber-50
        iconColor: "#b45309", // amber-700
        borderColor: "#fde68a", // amber-200
        badgeBg: "#fffbeb",
        badgeText: "#b45309",
        badgeBorder: "#fde68a",
        iconName: "pencil",
        label: "EDITADO",
      };
    case "excluido":
      return {
        bg: "#f9fafb", // gray-50
        iconColor: "#6b7280", // gray-600
        borderColor: "#e5e7eb", // gray-200
        badgeBg: "#f9fafb",
        badgeText: "#374151", // gray-700
        badgeBorder: "#e5e7eb",
        iconName: "trash",
        label: "EXCLUÍDO",
      };
    default:
      return {
        bg: "#f8fafc", // slate-50
        iconColor: "#64748b", // slate-500
        borderColor: "#e2e8f0", // slate-200
        badgeBg: "#f8fafc",
        badgeText: "#64748b",
        badgeBorder: "#e2e8f0",
        iconName: "circle",
        label: "OUTRO",
      };
  }
};

interface DashboardData {
  totalEstoque: number;
  movimentacoesHoje: number;
  ultimoItem: any | null;
  recentLogs: LogItemProps[];
}

export default function Index() {
  const router = useRouter();
  
  const [uiState, setUiState] = useState({
    loading: true,
    refreshing: false,
  });

  const [data, setData] = useState<DashboardData>({
    totalEstoque: 0,
    movimentacoesHoje: 0,
    ultimoItem: null,
    recentLogs: [],
  });

  const formatarData = useCallback((isoString: string) => {
    if (!isoString) return "--/--/---- --:--:--";
    try {
      const dataObj = new Date(isoString);
      if (isNaN(dataObj.getTime())) return "--/--/----";
      return `${dataObj.toLocaleDateString("pt-BR")} ${dataObj.toLocaleTimeString("pt-BR")}`;
    } catch {
      return "--/--/----";
    }
  }, []);

  const carregarDados = useCallback(async (silencioso = false) => {
    if (!silencioso) {
      setUiState((prev) => ({ ...prev, loading: true }));
    }

    try {
      const [produtosAtivos, movimentos] = await Promise.all([
        api.getProdutos(),
        api.getMovimentacoes(),
      ]);

      let novoTotalEstoque = 0;
      if (Array.isArray(produtosAtivos)) {
        novoTotalEstoque = produtosAtivos.length;
      }

      let novasMovimentacoesHoje = 0;
      let novoUltimoItem = null;
      let novosLogs: LogItemProps[] = [];

      if (Array.isArray(movimentos)) {
        const hoje = new Date();
        const diaHoje = hoje.getDate();
        const mesHoje = hoje.getMonth();
        const anoHoje = hoje.getFullYear();

        const movsHoje = movimentos.filter((m: any) => {
          if (!m.timestamp) return false;
          const dataMov = new Date(m.timestamp);
          return (
            dataMov.getDate() === diaHoje &&
            dataMov.getMonth() === mesHoje &&
            dataMov.getFullYear() === anoHoje
          );
        });
        novasMovimentacoesHoje = movsHoje.length;

        if (movimentos.length > 0) {
          novoUltimoItem = movimentos[0];
        }

        // ✅ ATUALIZADO: Agora mantém o tipo original da ação
        novosLogs = movimentos.slice(0, 5).map((m: any) => ({
          type: m.tipo || "entrada", // Mantém o tipo original (entrada, saida, leitura, editado, excluido)
          item: m.nome || "Produto Desconhecido",
          quantity: 1,
          timestamp: formatarData(m.timestamp),
        }));
      }

      setData({
        totalEstoque: novoTotalEstoque,
        movimentacoesHoje: novasMovimentacoesHoje,
        ultimoItem: novoUltimoItem,
        recentLogs: novosLogs,
      });

    } catch (error) {
      console.error(error);
    } finally {
      setUiState((prev) => ({ ...prev, loading: false, refreshing: false }));
    }
  }, [formatarData]);

  useFocusEffect(
    useCallback(() => {
      let interval: any;

      carregarDados(false);

      interval = setInterval(() => {
        carregarDados(true);
      }, 5000);

      return () => clearInterval(interval);
    }, [carregarDados])
  );

  const handleRefresh = useCallback(() => {
    setUiState((prev) => ({ ...prev, refreshing: true }));
    carregarDados(true);
  }, [carregarDados]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <Navbar />

      <ScrollView
        contentContainerStyle={indexStyles.contentContainer}
        style={indexStyles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={uiState.refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={indexStyles.lastItem}>
          <View style={indexStyles.lastSetItem}>
            <FontAwesome6 name="qrcode" size={24} color={Colors.primary} />
            <Text style={indexStyles.title}>Ultimo Ítem Escaneado</Text>
          </View>
          <View style={indexStyles.hr}></View>

          <View style={indexStyles.imagePlaceholder}>
            <FontAwesome
              name="camera"
              size={30}
              color="gray"
              style={indexStyles.icon}
            />
            <Image
              style={indexStyles.imagem}
              source={{
                uri: "https://placehold.co/400x200/cccccc/333333?text=Imagem",
              }}
            />
          </View>

          <View style={indexStyles.itemInfo}>
            <View>
              <Text style={indexStyles.itemTitle}>PRODUTO</Text>
              <Text style={indexStyles.itemSubtitle}>
                {uiState.loading && !data.ultimoItem
                  ? "Carregando..."
                  : data.ultimoItem
                  ? data.ultimoItem.nome || "Produto Desconhecido"
                  : "Aguardando leitura..."}
              </Text>
            </View>

            <View>
              <Text style={indexStyles.itemTitle}>DATA E HORA</Text>
              <Text style={indexStyles.itemSubtitle}>
                {uiState.loading && !data.ultimoItem
                  ? "--/--/----"
                  : data.ultimoItem
                  ? formatarData(data.ultimoItem.timestamp)
                  : "--/--/---- --:--:--"}
              </Text>
            </View>
          </View>
        </View>

        <View style={indexStyles.cardsWrapper}>
          <View style={indexStyles.cards}>
            <View style={indexStyles.itens}>
              {uiState.loading && data.totalEstoque === 0 ? (
                <ActivityIndicator color={Colors.primary} />
              ) : (
                <Text style={indexStyles.titulo}>{data.totalEstoque}</Text>
              )}
              <Text style={indexStyles.subtitulo}>Itens em Estoque</Text>
            </View>
            <FontAwesome6
              name="boxes-stacked"
              size={80}
              color={Colors.icone || "#ccc"}
            />
          </View>
          <TouchableOpacity
            style={indexStyles.infoButton}
            activeOpacity={0.9}
            onPress={() => router.push("/(tabs)/gerenciar")}
          >
            <Text style={indexStyles.buttonText}>Ver Catálogo</Text>
            <AntDesign name="plus-circle" size={14} color="white" />
          </TouchableOpacity>
        </View>

        <View style={indexStyles.cardsWrapper}>
          <View style={indexStyles.cards}>
            <View style={indexStyles.itens}>
              {uiState.loading && data.movimentacoesHoje === 0 && uiState.loading ? (
                 <ActivityIndicator color={Colors.primary} />
              ) : (
                <Text style={indexStyles.titulo}>{data.movimentacoesHoje}</Text>
              )}
              <Text style={indexStyles.subtitulo}>Movimentações Hoje</Text>
            </View>
            <FontAwesome6
              name="box-open"
              size={80}
              color={Colors.icone || "#ccc"}
            />
          </View>
          <TouchableOpacity
            style={indexStyles.infoButton}
            activeOpacity={0.9}
            onPress={() => router.push("/(tabs)/historico")}
          >
            <Text style={indexStyles.buttonText}>Ver Histórico</Text>
            <AntDesign name="plus-circle" size={14} color="white" />
          </TouchableOpacity>
        </View>

       <View style={indexStyles.logCard}>
          <View style={indexStyles.logHeader}>
            <View style={{ padding: 8, backgroundColor: '#eff6ff', borderRadius: 8, borderWidth: 1, borderColor: '#bfdbfe' }}>
                <MaterialCommunityIcons name="clipboard-clock-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={indexStyles.sectionTitle}>Log de Atividades</Text>
          </View>
          
          <View style={indexStyles.hr}></View>

          <View style={indexStyles.logList}>
            {uiState.loading && data.recentLogs.length === 0 ? (
              <ActivityIndicator size="large" color={Colors.primary} style={{ marginVertical: 20 }} />
            ) : data.recentLogs.length === 0 ? (
              <Text style={indexStyles.emptyText}>Nenhuma atividade recente.</Text>
            ) : (
              data.recentLogs.map((log, index) => {
                const style = getLogStyle(log.type);
                return (
                  <View key={index} style={indexStyles.logItem}>
                    <View style={indexStyles.logLeft}>
                        <View style={[indexStyles.logIcon, { backgroundColor: style.bg, borderColor: style.borderColor }]}>
                            <FontAwesome name={style.iconName as any} size={14} color={style.iconColor} />
                        </View>
                        
                        <View style={indexStyles.logDetails}>
                            <Text style={indexStyles.logTime}>{log.timestamp}</Text>
                        </View>
                    </View>
                    <View style={[indexStyles.logBadge, { backgroundColor: style.badgeBg, borderColor: style.badgeBorder }]}>
                        <Text style={[indexStyles.logBadgeText, { color: style.badgeText }]}>
                            {style.label}
                        </Text>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </View>

        <View style={{ height: 10 }} />
      </ScrollView>
    </View>
  );
}