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
    borderWidth: 1, 
    borderColor: "gray",
    fontFamily: "Roboto-Medium",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingRight: 50,
    paddingVertical: 12,
    elevation: 2,
  },
  buscarFocused: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  iconBuscar: {
    position: "absolute",
    color: 'gray',
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
    elevation: 2,
  },
  textoBotao: {
    fontFamily: "Roboto-Bold",
    color: "white",
    fontSize: 16,
  },
  tabelaContainer: {
    gap: 15,
    elevation: 2,
  },
  tabela: {
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: '#cbd5e1',
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
    borderBottomColor: "#cbd5e1",
    alignItems: "center",
  },
  linhaAlt: {
    backgroundColor: "white",
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
    width: 100,
    textAlign: "left",
    fontFamily: "Roboto-Bold",
  },
  colProduto: {
    width: 180,
  },
  colAcao: {
    width: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colData: {
    width: 120,
    textAlign: "center",
  },
  colHora: {
    width: 100,
    textAlign: "center",
  },
  
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
    textTransform: 'uppercase',
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