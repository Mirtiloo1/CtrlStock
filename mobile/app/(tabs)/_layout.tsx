import { Colors } from "@/constants/Colors";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TabLayout = () => {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom", "left", "right"]}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarStyle: {
            position: "absolute",
            left: 16,
            right: 16,
            backgroundColor: Colors.primary,
            borderTopRightRadius: 14,
            borderTopLeftRadius: 14,
            height: 70,
            borderTopWidth: 0,
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: Platform.OS === "android" ? 6 : 10,
          },
          tabBarActiveTintColor: "#fff",
          tabBarInactiveTintColor: "rgba(255, 255, 255, 0.65)",
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: "Roboto-Bold",
            marginTop: 2,
          },
          tabBarItemStyle: {
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 4,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="view-dashboard-outline"
                size={22}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="historico"
          options={{
            title: "Histórico",
            tabBarIcon: ({ color }) => (
              <FontAwesome5 name="history" size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="gerenciar"
          options={{
            title: "Gerenciar",
            tabBarIcon: ({ color }) => (
              <FontAwesome6 name="bars-staggered" size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="sobre"
          options={{
            title: "Sobre",
            tabBarIcon: ({ color }) => (
              <FontAwesome6 name="address-card" size={20} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
};

export default TabLayout;
