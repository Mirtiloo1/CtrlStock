import { StyleSheet } from "react-native";
import { Colors } from "../../constants/Colors";

export const styles = StyleSheet.create({
  safeAreaContainer: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    position: "relative",
    marginTop: 6,
  },
  statusBoxContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  statusBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 10,
    gap: 5,
  },
  statusText: {
    color: "#4D6C4D",
    fontFamily: "Roboto-Regular",
    fontWeight: "700",
    fontSize: 14,
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 4,
  },
  btnSair: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 0,
    minWidth: 44,
    minHeight: 44,
  },
  btnLogin: {
    backgroundColor: Colors.botao,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 0,
    minWidth: 44,
    minHeight: 44,
  },
  textLogin: {
    color: "white",
    fontSize: 14,
    fontFamily: "Roboto-Medium",
  },
});