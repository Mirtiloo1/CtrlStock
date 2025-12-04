import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextData {
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const token = await AsyncStorage.getItem("@ctrlstock_token");
        if (token) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    loadStorageData();
  }, []);

  async function signIn(token: string) {
    try {
      await AsyncStorage.setItem("@ctrlstock_token", token);
      setIsAuthenticated(true);
    } catch (error) {
      console.log(error);
    }
  }

  async function signOut() {
    try {
      await AsyncStorage.removeItem("@ctrlstock_token");
      setIsAuthenticated(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};