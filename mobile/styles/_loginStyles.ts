import { StyleSheet, Platform } from "react-native";
import { Colors } from "@/constants/Colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
    justifyContent: "center",
    padding: 12,
  },
  loginForm: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 32,
    paddingHorizontal: 30,
    width: "100%",
    maxWidth: 400,
    alignSelf: "center", 
    flexDirection: "column",
    gap: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  ctrlStock: {
    color: Colors.primary,
    fontFamily: "Roboto-Regular",
    fontSize: 24,
  },
  acesse: {
    color: Colors.primary,
    fontFamily: "Roboto-Bold",
    fontSize: 30,
  },
  inputLabel: {
    color: Colors.primary,
    fontFamily: "Roboto-Medium",
  },
  inputContainer: {
    flexDirection: "column",
    gap: 16,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 14,
    paddingRight: 50,
    height: 50,
    fontFamily: "Roboto-Medium",
    fontSize: 16,
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }), 
  },
  inputFocused: {
    borderColor: Colors.primary,
  },
  inputGap: {
    flexDirection: "column",
    gap: 6,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  btnEntrar: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 10,
  },
  btnText: {
    color: "white",
    fontFamily: "Roboto-Bold",
    fontSize: 18,
  },
  bottomContainer: {
    flexDirection: "column",
    gap: 8,
  },
  linkText: {
    textAlign: "center",
    color: Colors.primary,
    fontFamily: "Roboto-Medium",
    textDecorationLine: "underline",
  },
});