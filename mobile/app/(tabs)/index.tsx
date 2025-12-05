import { useRouter, useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
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
  type: string;
  item: string;
  quantity: number;
  timestamp: string;
}

interface DashboardData {
  totalEstoque: number;
  movimentacoesHoje: number;
  ultimoItem: any | null;
  recentLogs: LogItemProps[];
}

const LOG_STYLES = {
  entrada: {
    bg: "#ecfdf5",
    iconColor: "#16a34a",
    borderColor: "#bbf7d0",
    badgeBg: "#ecfdf5",
    badgeText: "#15803d",
    badgeBorder: "#bbf7d0",
    iconName: "arrow-up",
    label: "ENTRADA",
  },
  saida: {
    bg: "#fef2f2",
    iconColor: "#dc2626",
    borderColor: "#fecaca",
    badgeBg: "#fef2f2",
    badgeText: "#b91c1c",
    badgeBorder: "#fecaca",
    iconName: "arrow-down",
    label: "SAÍDA",
  },
  leitura: {
    bg: "#eff6ff",
    iconColor: "#1d4ed8",
    borderColor: "#bfdbfe",
    badgeBg: "#eff6ff",
    badgeText: "#1d4ed8",
    badgeBorder: "#bfdbfe",
    iconName: "exchange",
    label: "LEITURA",
  },
  editado: {
    bg: "#fffbeb",
    iconColor: "#b45309",
    borderColor: "#fde68a",
    badgeBg: "#fffbeb",
    badgeText: "#b45309",
    badgeBorder: "#fde68a",
    iconName: "pencil",
    label: "EDITADO",
  },
  excluido: {
    bg: "#f9fafb",
    iconColor: "#6b7280",
    borderColor: "#e5e7eb",
    badgeBg: "#f9fafb",
    badgeText: "#374151",
    badgeBorder: "#e5e7eb",
    iconName: "trash",
    label: "EXCLUÍDO",
  },
  default: {
    bg: "#f8fafc",
    iconColor: "#64748b",
    borderColor: "#e2e8f0",
    badgeBg: "#f8fafc",
    badgeText: "#64748b",
    badgeBorder: "#e2e8f0",
    iconName: "circle",
    label: "OUTRO",
  },
} as const;

const getLogStyle = (type: string) => {
  const key = (type || "entrada").toLowerCase();
  return (
    LOG_STYLES[key as keyof typeof LOG_STYLES] ||
    LOG_STYLES.leitura ||
    LOG_STYLES.default
  );
};

const formatarData = (isoString: string): string => {
  if (!isoString) return "--/--/---- --:--:--";
  try {
    const dataObj = new Date(isoString);
    if (isNaN(dataObj.getTime())) return "--/--/----";
    return `${dataObj.toLocaleDateString("pt-BR")} ${dataObj.toLocaleTimeString(
      "pt-BR"
    )}`;
  } catch {
    return "--/--/----";
  }
};

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

  const carregarDados = useCallback(async (silencioso = false) => {
    if (!silencioso) {
      setUiState((prev) => ({ ...prev, loading: true }));
    }

    try {
      const [produtosAtivos, movimentos] = await Promise.all([
        api.getProdutos(),
        api.getMovimentacoes(),
      ]);

      const hoje = new Date();
      const inicioHoje = new Date(hoje.setHours(0, 0, 0, 0));

      const movsHoje = Array.isArray(movimentos)
        ? movimentos.filter((m: any) => {
            if (!m.timestamp) return false;
            const dataMov = new Date(m.timestamp);
            return dataMov >= inicioHoje;
          })
        : [];

      const novosLogs: LogItemProps[] = Array.isArray(movimentos)
        ? movimentos.slice(0, 5).map((m: any) => ({
            type: m.tipo || "entrada",
            item: m.nome || "Produto Desconhecido",
            quantity: 1,
            timestamp: formatarData(m.timestamp),
          }))
        : [];

      setData({
        totalEstoque: Array.isArray(produtosAtivos) ? produtosAtivos.length : 0,
        movimentacoesHoje: movsHoje.length,
        ultimoItem: movimentos?.[0] || null,
        recentLogs: novosLogs,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setUiState((prev) => ({ ...prev, loading: false, refreshing: false }));
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarDados(false);
      const interval = setInterval(() => carregarDados(true), 5000);
      return () => clearInterval(interval);
    }, [carregarDados])
  );

  const handleRefresh = useCallback(() => {
    setUiState((prev) => ({ ...prev, refreshing: true }));
    carregarDados(true);
  }, [carregarDados]);

  const ultimoItemFormatado = useMemo(() => {
    if (!data.ultimoItem) return null;
    return {
      nome: data.ultimoItem.nome || "Produto Desconhecido",
      timestamp: formatarData(data.ultimoItem.timestamp),
      imagem: data.ultimoItem.imagem,
      tipo: data.ultimoItem.tipo,
    };
  }, [data.ultimoItem]);

  const statusStyle = ultimoItemFormatado
    ? getLogStyle(ultimoItemFormatado.tipo)
    : null;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <Navbar />

      <ScrollView
        contentContainerStyle={indexStyles.contentContainer}
        style={indexStyles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={uiState.refreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        <View style={indexStyles.lastItem}>
          <View style={indexStyles.lastSetItem}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <FontAwesome6 name="qrcode" size={24} color={Colors.primary} />
              <Text style={indexStyles.title}>Última atualização</Text>
            </View>

            {statusStyle && (
              <View
                style={[
                  indexStyles.logBadge,
                  {
                    backgroundColor: statusStyle.badgeBg,
                    borderColor: statusStyle.badgeBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    indexStyles.logBadgeText,
                    { color: statusStyle.badgeText },
                  ]}
                >
                  {statusStyle.label}
                </Text>
              </View>
            )}
          </View>

          <View style={indexStyles.hr}></View>

          <View style={indexStyles.imagePlaceholder}>
            {ultimoItemFormatado?.imagem ? (
              <Image
                style={[indexStyles.imagem, { borderWidth: 0 }]}
                source={{ uri: ultimoItemFormatado.imagem }}
                resizeMode="cover"
              />
            ) : (
              <>
                <FontAwesome
                  name="camera"
                  size={30}
                  color="gray"
                  style={indexStyles.icon}
                />
                <View style={indexStyles.imagem} />
              </>
            )}
          </View>

          <View style={indexStyles.itemInfo}>
            <View>
              <Text style={indexStyles.itemTitle}>PRODUTO</Text>
              <Text style={indexStyles.itemSubtitle}>
                {uiState.loading && !ultimoItemFormatado
                  ? "Carregando..."
                  : ultimoItemFormatado?.nome || "Aguardando leitura..."}
              </Text>
            </View>

            <View>
              <Text style={indexStyles.itemTitle}>DATA E HORA</Text>
              <Text style={indexStyles.itemSubtitle}>
                {uiState.loading && !ultimoItemFormatado
                  ? "--/--/----"
                  : ultimoItemFormatado?.timestamp || "--/--/---- --:--:--"}
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
              {uiState.loading && data.movimentacoesHoje === 0 ? (
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
            <View style={{ padding: 8 }}>
              <MaterialCommunityIcons
                name="clipboard-clock-outline"
                size={20}
                color={Colors.primary}
              />
            </View>
            <Text style={indexStyles.sectionTitle}>Log de Atividades</Text>
          </View>

          <View style={indexStyles.hr}></View>

          <View style={indexStyles.logList}>
            {uiState.loading && data.recentLogs.length === 0 ? (
              <ActivityIndicator
                size="large"
                color={Colors.primary}
                style={{ marginVertical: 20 }}
              />
            ) : data.recentLogs.length === 0 ? (
              <Text style={indexStyles.emptyText}>
                Nenhuma atividade recente.
              </Text>
            ) : (
              data.recentLogs.map((log, index) => {
                const style = getLogStyle(log.type);
                return (
                  <View key={index} style={indexStyles.logItem}>
                    <View style={indexStyles.logLeft}>
                      <View
                        style={[
                          indexStyles.logIcon,
                          {
                            backgroundColor: style.bg,
                            borderColor: style.borderColor,
                          },
                        ]}
                      >
                        <FontAwesome
                          name={style.iconName as any}
                          size={14}
                          color={style.iconColor}
                        />
                      </View>

                      <View style={indexStyles.logDetails}>
                        <Text style={indexStyles.logProduct}>{log.item}</Text>
                        <Text style={indexStyles.logTime}>{log.timestamp}</Text>
                      </View>
                    </View>
                    <View
                      style={[
                        indexStyles.logBadge,
                        {
                          backgroundColor: style.badgeBg,
                          borderColor: style.badgeBorder,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          indexStyles.logBadgeText,
                          { color: style.badgeText },
                        ]}
                      >
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
