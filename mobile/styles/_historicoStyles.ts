import { StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

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
  containerTopo: {
    flexDirection: "column",
    gap: 20,
  },
  title: {
    color: Colors.primary,
    fontFamily: "Roboto-Bold",
    fontSize: 20,
    textAlign: "left",
  },
  containerBuscar: {
    position: "relative",
  },
  buscar: {
    backgroundColor: "white",
    outlineColor: "gray",
    outlineStyle: "solid",
    fontFamily: "Roboto-Medium",
    outlineWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingRight: 50,
    paddingVertical: 12,
  },
  buscarFocused: {
    outlineColor: Colors.primary,
    outlineWidth: 2,
  },
  iconBuscar: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  iconLimpar: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{ translateY: -11 }],
    zIndex: 2,
  },
  botaoExportar: {
    flexDirection: "row",
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    gap: 10,
    height: 50,
  },
  textoBotao: {
    fontFamily: "Roboto-Bold",
    color: "white",
    fontSize: 16,
  },
  tabelaContainer: {
    gap: 15,
  },
  tabela: {
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  header: {
    flexDirection: "row",
    backgroundColor: Colors.primary,
  },
  headerText: {
    color: "white",
    fontFamily: "Roboto-Bold",
  },
  linha: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  linhaAlt: {
    backgroundColor: Colors.headerTabela,
  },
  celula: {
    padding: 15,
    fontSize: 14,
  },
  celulaData: {
    padding: 15,
    fontSize: 14,
    color: "#333",
    fontFamily: "Roboto-Regular",
  },
  colID: {
    width: 60,
    textAlign: "center",
    fontFamily: "Roboto-Bold",
  },
  colProduto: {
    width: 180,
  },
  colData: {
    width: 120,
    textAlign: "center",
  },
  colHora: {
    width: 100,
    textAlign: "center",
  },
  colAcao: {
    width: 100,
    textAlign: "center",
  },
  colAcaoEntrada: {
    width: 100,
    textAlign: "center",
    color: Colors.primary,
    fontFamily: "Roboto-Medium",
  },
  colAcaoSaida: {
    width: 100,
    textAlign: "center",
    color: Colors.vermelho,
    fontFamily: "Roboto-Medium",
  },
  totalItens: {
    textAlign: "center",
    fontFamily: "Roboto-Medium",
    fontSize: 14,
    color: Colors.primary,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
  },
  deslizar: {
    alignItems: "center",
    justifyContent: "center",
  },
  textDeslizar: {
    color: "gray",
    fontFamily: "Roboto-Medium",
  },
  listaVaziaContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  listaVaziaTexto: {
    fontFamily: "Roboto-Bold",
    fontSize: 16,
    color: "#555",
  },
  listaVaziaSubtexto: {
    fontFamily: "Roboto-Regular",
    fontSize: 14,
    color: "#888",
    marginTop: 8,
  },
});
