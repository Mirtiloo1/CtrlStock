import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  logCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  iconWrapper: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  logText: {
    fontSize: 15,
    fontFamily: "Roboto-Regular",
    color: "#333",
  },
  quantityText: {
    fontFamily: "Roboto-Bold",
    fontSize: 16,
  },
  timestampText: {
    fontSize: 12,
    color: "gray",
    marginTop: 2,
  },
  rightInfo: {
    alignItems: "flex-end",
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    color: "white",
    fontSize: 10,
    fontFamily: "Roboto-Bold",
  },
});
