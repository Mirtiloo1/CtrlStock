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

export default function Navbar() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { isAuthenticated, signOut } = useAuth();

  const { width } = useWindowDimensions();
  const isSmallDevice = width < 380;

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
              style={[styles.statusText, isSmallDevice && { fontSize: 12 }]}
            >
              {isAuthenticated ? "Conectado" : "Desconectado"}
            </Text>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isAuthenticated ? "#4CAF50" : "#ccc" },
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
              size={isSmallDevice ?20 : 24}
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
