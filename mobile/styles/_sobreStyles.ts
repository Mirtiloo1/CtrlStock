import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 22,
    gap: 30,
  },
  ctrlStock: {
    flexDirection: "column",
    gap: 24,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 24,
  },
  mainTitle: {
    color: Colors.primary,
    fontFamily: "Roboto-Bold",
    fontSize: 28,
    textAlign: "center",
  },
  text: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    textAlign: "justify",
    lineHeight: 22,
  },
  
  cardContainer: {
    flexDirection: "column",
  },
  card: {
    flex: 1,
    backgroundColor: Colors.primary,
    flexDirection: "column",
    gap: 12,
    alignItems: "center",
    justifyContent: 'center',
    borderRadius: 8,
    padding: 18,
  },
  cardText: {
    color: "white",
    fontFamily: "Roboto-Medium",
    fontSize: 20,
  },
  cardSubText: {
    color: "white",
    fontFamily: "Roboto-Regular",
    fontSize: 14,
  },
  
  objetivoContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 32,
    flexDirection: "column",
    gap: 22,
  },
  cardObjetivos: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  iconObjetivo: {
    width: 24,
    textAlign: "center",
  },
  textObjetivo: {
    flex: 1,
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
  textObjetivoTitle: {
    fontFamily: "Roboto-Bold",
    fontSize: 16,
    color: Colors.primary,
  },

  footerContainer: {
    marginTop: 20,
    paddingTop: 24,
    paddingBottom: 24,
    gap: 16,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
  },
  footerTitle: {
    color: Colors.primary,
    fontFamily: "Roboto-Bold",
    fontSize: 22,
    marginBottom: 8,
  },
  contactInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  contactEmail: {
    fontFamily: "Roboto-Medium",
    fontSize: 16,
    color: Colors.primary,
  },

  socialLinksContainer: {
    flexDirection: "row",
    gap: 20,
    marginTop: 8,
  },
  socialButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    height: 1,
    width: "90%",
    backgroundColor: "#e0e0e0",
    marginVertical: 8,
  },
  footerText: {
    fontFamily: "Roboto-Medium",
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  footerNames: {
    fontFamily: "Roboto-Medium",
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    paddingHorizontal: 16,
  },
});