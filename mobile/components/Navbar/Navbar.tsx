import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./_NavbarStyles";

export default function Navbar() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { width } = useWindowDimensions();

  const isSmallDevice = width < 380;

  useFocusEffect(
    useCallback(() => {
      const checkLoginStatus = async () => {
        try {
          const token = await AsyncStorage.getItem("@ctrlstock_token");
          setIsLoggedIn(!!token);
        } catch (error) {
          console.log("Erro ao verificar token:", error);
        }
      };
      checkLoginStatus();
    }, [])
  );

  const handleLogout = async () => {
    Alert.alert("Sair", "Deseja desconectar da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("@ctrlstock_token");
            await AsyncStorage.removeItem("@ctrlstock_user");
            setIsLoggedIn(false);
            router.replace("/(tabs)/login");
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
              {isLoggedIn ? "Conectado" : "Desconectado"}
            </Text>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isLoggedIn ? "#4CAF50" : "#ccc" },
                isSmallDevice && { width: 7, height: 7 },
              ]}
            />
          </View>
        </View>

        {isLoggedIn ? (
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
              size={isSmallDevice ? 18 : 21}
              color="white"
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.btnLogin,
              isSmallDevice && { padding: 8, minWidth: 40, minHeight: 40 },
            ]}
            onPress={() => router.push("/(tabs)/login")}
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
