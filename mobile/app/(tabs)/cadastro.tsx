import { Colors } from "@/constants/Colors";
import { api } from "@/services/api";
import { styles } from "@/styles/_cadastroStyles";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [nomeFocused, setNomeFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);
  const [confPassFocused, setConfPassFocused] = useState(false);

  const handleRegister = async () => {
    if (!nome || !email || !password) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }
    setLoading(true);
    const resultado = await api.cadastrarUsuario(nome, email, password);
    setLoading(false);
    if (resultado.success) {
      Alert.alert("Sucesso", "Conta criada! Faça login para continuar.", [
        { text: "OK", onPress: () => router.replace("/(tabs)/login") },
      ]);
    } else {
      Alert.alert("Erro", resultado.message || "Falha ao cadastrar.");
    }
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cadastroForm}>
          <View style={styles.titleContainer}>
            <Text style={styles.ctrlStock}>CtrlStock</Text>
            <Text style={styles.crieConta}>Crie sua conta</Text>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputGap}>
              <Text style={styles.inputLabel}>Nome</Text>
              <TextInput
                style={[styles.input, nomeFocused && styles.inputFocused]}
                placeholder="Seu nome"
                placeholderTextColor="#999"
                value={nome}
                onChangeText={setNome}
                onFocus={() => setNomeFocused(true)}
                onBlur={() => setNomeFocused(false)}
              />
            </View>

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
                  style={[styles.input, passFocused && styles.inputFocused]}
                  placeholder="••••••••"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  onFocus={() => setPassFocused(true)}
                  onBlur={() => setPassFocused(false)}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                >
                  <FontAwesome5
                    name={showPassword ? "eye" : "eye-slash"}
                    size={18}
                    color={passFocused ? Colors.primary : "#999"}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGap}>
              <Text style={styles.inputLabel}>Confirmar senha</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, confPassFocused && styles.inputFocused]}
                  placeholder="••••••••"
                  placeholderTextColor="#999"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  onFocus={() => setConfPassFocused(true)}
                  onBlur={() => setConfPassFocused(false)}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  activeOpacity={0.7}
                >
                  <FontAwesome5
                    name={showConfirmPassword ? "eye" : "eye-slash"}
                    size={18}
                    color={confPassFocused ? Colors.primary : "#999"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.bottomContainer}>
            <TouchableOpacity
              style={styles.btnCadastrar}
              onPress={handleRegister}
              activeOpacity={0.9}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.btnText}>Cadastrar</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogin} activeOpacity={0.7}>
              <Text style={styles.linkText}>Já tem conta? Faça login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
