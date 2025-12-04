import { Colors } from "@/constants/Colors";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services/api";
import { styles } from "@/styles/_loginStyles";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Atenção", "Preencha e-mail e senha.");
      return;
    }

    setLoading(true);
    try {
      const resultado = await api.login(email, password);

      if (resultado.success) {
        const token = resultado.token || "token-dummy-autenticado";

        await signIn(token);
      } else {
        Alert.alert("Erro", resultado.message || "Email ou senha inválidos.");
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao tentar fazer login.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Em breve",
      "Funcionalidade de recuperar senha será implementada."
    );
  };

  const handleRegister = () => {
    router.push("/cadastro");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.loginForm}>
        <View style={styles.titleContainer}>
          <Text style={styles.ctrlStock}>CtrlStock</Text>
          <Text style={styles.acesse}>Acesse sua conta</Text>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputGap}>
            <Text style={styles.inputLabel}>E-mail</Text>
            <TextInput
              style={[styles.input, emailFocused && styles.inputFocused]}
              placeholder="seu@email.com"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
          </View>

          <View style={styles.inputGap}>
            <Text style={styles.inputLabel}>Senha</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, passwordFocused && styles.inputFocused]}
                placeholder="••••••••"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                <FontAwesome5
                  name={showPassword ? "eye" : "eye-slash"}
                  size={18}
                  color={passwordFocused ? Colors.primary : "#999"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.btnEntrar}
            onPress={handleLogin}
            activeOpacity={0.9}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.btnText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={handleForgotPassword} activeOpacity={0.7}>
            <Text style={styles.linkText}>Esqueceu sua senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleRegister} activeOpacity={0.7}>
            <Text style={styles.linkText}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
