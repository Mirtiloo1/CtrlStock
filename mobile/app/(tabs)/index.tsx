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
import ActivityLog from "../../components/LogsDeAtividade/ActivityLog";

interface LogItemProps {
  type: "IN" | "OUT";
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

        novosLogs = movimentos.slice(0, 5).map((m: any) => ({
          type:
            m.tipo === "leitura" || m.tipo === "cadastro" || m.tipo === "entrada"
              ? "IN"
              : "OUT",
          item: m.produto_nome || "Produto Desconhecido",
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
                  ? data.ultimoItem.produto_nome
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

        <View style={indexStyles.log}>
          <View style={indexStyles.logTitle}>
            <MaterialCommunityIcons
              name="clipboard-clock-outline"
              size={24}
              color={Colors.primary}
            />
            <Text style={indexStyles.title}>Log de Atividades</Text>
          </View>
          <View style={indexStyles.hr}></View>

          <View style={indexStyles.logs}>
            {uiState.loading && data.recentLogs.length === 0 ? (
              <ActivityIndicator size="large" color={Colors.primary} />
            ) : data.recentLogs.length === 0 ? (
              <Text
                style={{ textAlign: "center", color: "#999", marginTop: 10 }}
              >
                Nenhuma atividade recente.
              </Text>
            ) : (
              data.recentLogs.map((log, index) => (
                <ActivityLog key={index} {...log} />
              ))
            )}
          </View>
        </View>

        <View style={{ height: 10 }} />
      </ScrollView>
    </View>
  );
}