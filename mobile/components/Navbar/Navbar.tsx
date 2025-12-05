import { useAuth } from "../../hooks/useAuth";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import {
  Alert,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./_NavbarStyles";
import { useEffect, useState } from "react";
import { api } from "../../services/api";

export default function Navbar() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { isAuthenticated, signOut } = useAuth();

  const { width } = useWindowDimensions();
  const isSmallDevice = width < 380;

  const [modo, setModo] = useState("entrada");

  useEffect(() => {
    const verificarStatus = async () => {
      try {
        const dados = await api.getDeviceStatus();
        if (dados && dados.success && dados.state) {
          setModo(dados.state.mode);
        }
      } catch {
        // Falha silenciosa
      }
    };
    verificarStatus();
    const intervalo = setInterval(verificarStatus, 2000);
    return () => clearInterval(intervalo);
  }, []);

  const isEntrada = modo === "entrada";

  const handleLogout = async () => {
    if (Platform.OS === "web") {
      if (confirm("Deseja desconectar da sua conta?")) {
        try {
          await signOut();
        } catch (error) {
          console.log("Erro ao sair:", error);
        }
      }
      return;
    }

    Alert.alert("Sair", "Deseja desconectar da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
          } catch (error) {
            console.log("Erro ao sair:", error);
          }
        },
      },
    ]);
  };

  return (
    <View style={[styles.safeAreaContainer, { paddingTop: insets.top }]}>
      <View style={styles.container}>
        <View style={styles.statusBoxContainer}>
          <View
            style={[
              styles.statusBox,
              isSmallDevice && {
                paddingHorizontal: 12,
                paddingVertical: 10,
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                isSmallDevice && { fontSize: 12 },
                { flexDirection: "row" },
              ]}
            >
              <Text style={{ color: "black", fontWeight: "bold" }}>
                Status:{" "}
              </Text>
              <Text
                style={{
                  color: isEntrada ? "#2E7D32" : "#C62828",
                  fontWeight: "bold",
                }}
              >
                {isEntrada ? "Entrada" : "Saída"}
              </Text>
            </Text>

            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: isEntrada ? "#4CAF50" : "#F44336",
                  shadowColor: isEntrada ? "#4CAF50" : "#F44336",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.8,
                  shadowRadius: 4,
                  elevation: 5,
                },
                isSmallDevice && { width: 7, height: 7 },
              ]}
            />
          </View>
        </View>

        {isAuthenticated ? (
          <TouchableOpacity
            style={[
              styles.btnSair,
              isSmallDevice && { padding: 8, minWidth: 40, minHeight: 40 },
            ]}
            onPress={handleLogout}
            activeOpacity={0.75}
          >
            <FontAwesome6
              name="arrow-right-from-bracket"
              size={isSmallDevice ? 20 : 24}
              color="white"
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.btnLogin,
              isSmallDevice && { padding: 8, minWidth: 40, minHeight: 40 },
            ]}
            onPress={() => router.push("/(auth)/login")}
            activeOpacity={0.75}
          >
            <FontAwesome6
              name="arrow-right-to-bracket"
              size={isSmallDevice ? 18 : 21}
              color="white"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
