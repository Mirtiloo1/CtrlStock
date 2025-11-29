import React from "react";
import {
  FlatList,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Navbar from "@/components/Navbar/Navbar";
import { Colors } from "@/constants/Colors";
import {
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  MaterialIcons,
} from "@expo/vector-icons";
import Fontisto from "@expo/vector-icons/Fontisto";
import { styles } from "../../styles/_sobreStyles";

const techData = [
  {
    key: "react",
    icon: <FontAwesome5 name="react" size={60} color="white" />,
    title: "React Native",
    subtitle: "Framework Frontend",
  },
  {
    key: "node",
    icon: <Fontisto name="nodejs" size={60} color="white" />,
    title: "NodeJs",
    subtitle: "Backend e APIs",
  },
  {
    key: "nfc",
    icon: <FontAwesome5 name="wifi" size={60} color="white" />,
    title: "NFC",
    subtitle: "Sinal por Proximidade",
  },
  {
    key: "esp32",
    icon: <FontAwesome6 name="microchip" size={60} color="white" />,
    title: "ESP32",
    subtitle: "Microcontrolador IoT",
  },
];

const TechCard = ({ item }: { item: (typeof techData)[0] }) => (
  <View style={styles.card}>
    {item.icon}
    <Text style={styles.cardText}>{item.title}</Text>
    <Text style={styles.cardSubText}>{item.subtitle}</Text>
  </View>
);

export default function Historico() {
  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.ctrlStock}>
          <Text style={styles.mainTitle}>Projeto CtrlStock</Text>
          <Text style={styles.text}>
            O presente projeto tem como finalidade o desenvolvimento de um
            protótipo de Sistema de Controle de Estoque por Aproximação,
            utilizando a tecnologia de comunicação por campo de proximidade
            (NFC) para monitorar e registrar a movimentação de produtos. A
            proposta busca demonstrar, de forma simplificada e de baixo custo, a
            lógica e a viabilidade de sistemas de inventário automatizado.
          </Text>
        </View>

        <View style={styles.cardContainer}>
          <Text style={styles.mainTitle}>Tecnologias Usadas</Text>
          <FlatList
            data={techData}
            renderItem={({ item }) => <TechCard item={item} />}
            keyExtractor={(item) => item.key}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={{ gap: 16 }}
            contentContainerStyle={{ gap: 16, marginTop: 24 }}
          />
        </View>

        <View style={styles.objetivoContainer}>
          <Text style={styles.mainTitle}>Objetivo do Sistema</Text>

          <View style={styles.cardObjetivos}>
            <FontAwesome5
              name="boxes"
              size={24}
              color={Colors.primary}
              style={styles.iconObjetivo}
            />
            <Text style={styles.textObjetivo}>
              <Text style={styles.textObjetivoTitle}>Controle de Estoque:</Text>
              Monitoramento em tempo real da movimentação de produtos
            </Text>
          </View>

          <View style={styles.cardObjetivos}>
            <MaterialIcons
              name="smartphone"
              size={24}
              color={Colors.primary}
              style={styles.iconObjetivo}
            />
            <Text style={styles.textObjetivo}>
              <Text style={styles.textObjetivoTitle}>Tecnologia NFC: </Text>
              Identificação rápida e segura através de tags NFC
            </Text>
          </View>

          <View style={styles.cardObjetivos}>
            <MaterialIcons
              name="attach-money"
              size={24}
              color={Colors.primary}
              style={styles.iconObjetivo}
            />
            <Text style={styles.textObjetivo}>
              <Text style={styles.textObjetivoTitle}>Baixo Custo: </Text>
              Solução acessível para pequenas e médias empresas
            </Text>
          </View>

          <View style={styles.cardObjetivos}>
            <FontAwesome6
              name="bolt-lightning"
              size={24}
              color={Colors.primary}
              style={styles.iconObjetivo}
            />
            <Text style={styles.textObjetivo}>
              <Text style={styles.textObjetivoTitle}>Automação: </Text>
              Redução de erros humanos e agilidade nos processos
            </Text>
          </View>
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerTitle}>Contato</Text>

          <View style={styles.contactInfo}>
            <MaterialIcons name="email" size={20} color={Colors.primary} />
            <Text style={styles.contactEmail}>contato@ctrlstock.com</Text>
          </View>

          <View style={styles.socialLinksContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() =>
                Linking.openURL("mailto:murilonunes2101@gmail.com")
              }
            >
              <FontAwesome name="google" size={22} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => Linking.openURL("https://github.com/Mirtiloo1/ctrlStock")}
            >
              <FontAwesome name="github" size={22} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton} onPress={() => {}}>
              <FontAwesome name="whatsapp" size={22} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <Text style={styles.footerText}>
            © 2025 CtrlStock. Todos os direitos reservados.
          </Text>
          <Text style={styles.footerNames}>
            Jefferson Kotoski, Murilo Pimentel
          </Text>
        </View>
      </ScrollView>
      <View style={{ height: 60 }} />
    </View>
  );
}
