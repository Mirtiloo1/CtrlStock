import { StyleSheet, Platform } from "react-native";
import { Colors } from "../constants/Colors";

export const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "transparent",
  },
  contentContainer: {
    flexDirection: "column",
    gap: 50,
    padding: 22,
    backgroundColor: "transparent",
  },
  lastItem: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 8,
    gap: 25,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  lastSetItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontFamily: "Roboto-Bold",
    fontSize: 18,
    color: Colors.primary,
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    position: "relative",
  },
  icon: {
    position: "absolute",
    zIndex: 1,
  },
  imagem: {
    width: "100%",
    aspectRatio: 1 / 1,
    backgroundColor: '#e5e5e8',
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    outlineStyle: "dashed",
    outlineColor: "#ccc",
    outlineWidth: 3,
  },
  hr: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  itemInfo: {
    display: "flex",
    gap: 40,
  },
  itemTitle: {
    fontFamily: "Roboto-Bold",
    fontSize: 14,
    color: Colors.primary,
  },
  itemSubtitle: {
    fontFamily: "Roboto-Bold",
    fontSize: 16,
  },
  cardsWrapper: {
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  cards: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 30,
  },
  itens: {
    justifyContent: "center",
  },
  titulo: {
    fontSize: 60,
    fontFamily: "Roboto-Bold",
    color: Colors.secondary,
    lineHeight: 65,
  },
  subtitulo: {
    fontSize: 18,
    color: Colors.primary,
    fontFamily: "Roboto-Bold",
  },

  infoButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: "white",
    fontFamily: "Roboto-Medium",
    fontSize: 16,
  },

   sectionTitle: {
    fontFamily: "Roboto-Bold",
    fontSize: 18,
    color: "#1e293b",
    letterSpacing: -0.5,
  },

   // SEÇÃO: LOG DE ATIVIDADES
  logCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  logHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  logList: {
    gap: 0,
  },
  logItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  logLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  logIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  logDetails: {
    flex: 1,
  },
  logProduct: {
    fontFamily: "Roboto-Bold",
    fontSize: 14,
    color: "#1e293b",
    marginBottom: 2,
  },
  logTime: {
    fontFamily: "Roboto-Regular",
    fontSize: 11,
    color: "black",
  },
  logBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  logBadgeText: {
    fontFamily: "Roboto-Bold",
    fontSize: 10,
    textTransform: 'uppercase',
  },
  emptyText: {
    textAlign: "center",
    color: "#94a3b8",
    marginVertical: 10,
    fontFamily: "Roboto-Regular",
  },
});
