import { StyleSheet } from "react-native";
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
    backgroundColor: Colors.background,
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
  log: {
    padding: 30,
    backgroundColor: "white",
    borderRadius: 8,
    flexDirection: "column",
    gap: 25,
  },
  logTitle: {
    flexDirection: "row",
    gap: 12,
  },
  logs: {
    flexDirection: "column",
    gap: 12,
    fontFamily: "Roboto-Medium",
  },
});
