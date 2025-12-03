import { StyleSheet, Platform } from "react-native";
import { Colors } from "@/constants/Colors";

// Paleta "Clean" (Slate) para combinar com a Web
const Theme = {
  bg: "#f1f5f9", // slate-100
  cardBg: "#ffffff",
  textDark: "#0f172a", // slate-900
  textMedium: "#334155", // slate-700
  textLight: "#64748b", // slate-500
  border: "#e2e8f0", // slate-200
  greenLight: "#ecfdf5", // green-50
  greenBorder: "#dcfce7", // green-100
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.bg,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    gap: 32, // Espaçamento maior entre seções
    paddingBottom: 40,
  },

  // --- Seção: Cabeçalho ---
  headerSection: {
    alignItems: "center",
    gap: 16,
  },
  mainTitle: {
    fontFamily: "Roboto-Bold",
    fontSize: 28,
    color: Theme.textDark,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  titleHighlight: {
    color: Colors.primary,
  },
  description: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    color: Theme.textLight,
    textAlign: "center",
    lineHeight: 24,
  },

  // --- Seção: Divisor com Texto ---
  dividerSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginVertical: 8,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#cbd5e1", // slate-300
  },
  sectionTitle: {
    fontFamily: "Roboto-Bold",
    fontSize: 12,
    color: Theme.textMedium,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  // --- Seção: Cards de Tecnologia ---
  techGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "space-between",
  },
  techCard: {
    width: "47%", // Para caber 2 por linha com gap
    backgroundColor: Theme.cardBg,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    // Estilo chave da Web: Borda lateral esquerda colorida
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    borderWidth: 1,
    borderColor: Theme.border,
    // Sombra suave
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Theme.greenLight,
    borderWidth: 1,
    borderColor: Theme.greenBorder,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  techTitle: {
    fontFamily: "Roboto-Bold",
    fontSize: 16,
    color: Theme.textDark,
    marginBottom: 4,
    textAlign: "center",
  },
  techSubtitle: {
    fontFamily: "Roboto-Medium",
    fontSize: 12,
    color: Theme.textLight,
    textAlign: "center",
  },

  // --- Seção: Objetivos (Cardão) ---
  objectivesCard: {
    backgroundColor: Theme.cardBg,
    borderRadius: 16,
    padding: 24,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    borderWidth: 1,
    borderColor: Theme.border,
    gap: 24,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12 },
      android: { elevation: 3 },
    }),
  },
  objectivesTitle: {
    fontFamily: "Roboto-Bold",
    fontSize: 22,
    color: Theme.textDark,
    textAlign: "center",
    marginBottom: 8,
  },
  objectiveItem: {
    flexDirection: "row",
    gap: 16,
    alignItems: "flex-start",
    backgroundColor: "#f8fafc", // Fundo suave no item mobile para toque
    padding: 12,
    borderRadius: 12,
  },
  objIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Theme.greenLight,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Theme.greenBorder,
  },
  objTextContainer: {
    flex: 1,
  },
  objTitle: {
    fontFamily: "Roboto-Bold",
    fontSize: 16,
    color: Theme.textDark, // slate-800
    marginBottom: 4,
  },
  objDesc: {
    fontFamily: "Roboto-Regular",
    fontSize: 14,
    color: Theme.textLight,
    lineHeight: 20,
  },

  // --- Footer (Simplificado para o estilo Clean) ---
  footer: {
    alignItems: "center",
    gap: 16,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: Theme.border,
  },
  footerText: {
    fontFamily: "Roboto-Medium",
    fontSize: 12,
    color: Theme.textLight,
  },
  footerNames: {
    fontFamily: "Roboto-Regular",
    fontSize: 12,
    color: "#94a3b8", // slate-400
  },
});