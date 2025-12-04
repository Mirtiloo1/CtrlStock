import React from "react";
import { ScrollView, Text, View } from "react-native";

import Navbar from "@/components/Navbar/Navbar";
import { Colors } from "@/constants/Colors";
import {
  FontAwesome5,
  FontAwesome6,
  MaterialIcons,
  Fontisto,
} from "@expo/vector-icons";
import { styles } from "../../styles/_sobreStyles";

const techData = [
  {
    key: "react",
    icon: <FontAwesome5 name="react" size={32} color={Colors.primary} />,
    title: "React Native",
    subtitle: "Interface Mobile",
  },
  {
    key: "js",
    icon: <FontAwesome5 name="js-square" size={32} color={Colors.primary} />,
    title: "JavaScript",
    subtitle: "Lógica",
  },
  {
    key: "node",
    icon: <Fontisto name="nodejs" size={28} color={Colors.primary} />,
    title: "Node.js",
    subtitle: "API Backend",
  },
  {
    key: "nfc",
    icon: <FontAwesome5 name="wifi" size={28} color={Colors.primary} />,
    title: "NFC",
    subtitle: "Comunicação",
  },
  {
    key: "esp32",
    icon: <FontAwesome6 name="microchip" size={32} color={Colors.primary} />,
    title: "ESP32",
    subtitle: "Hardware IoT",
  },
];

export default function Sobre() {
  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Text style={styles.mainTitle}>
            Projeto <Text style={styles.titleHighlight}>CtrlStock</Text>
          </Text>
          <Text style={styles.description}>
            Um protótipo de Sistema de Controle de Estoque por Aproximação
            (NFC), demonstrando viabilidade técnica e automação de baixo custo
            para gestão de inventário.
          </Text>
        </View>

        <View style={styles.dividerSection}>
          <View style={styles.line} />
          <Text style={styles.sectionTitle}>Tecnologias Utilizadas</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.techGrid}>
          {techData.map((item) => (
            <View key={item.key} style={styles.techCard}>
              <View style={styles.iconCircle}>{item.icon}</View>
              <Text style={styles.techTitle}>{item.title}</Text>
              <Text style={styles.techSubtitle}>{item.subtitle}</Text>
            </View>
          ))}
        </View>

        <View style={styles.objectivesCard}>
          <Text style={styles.objectivesTitle}>Objetivos do Sistema</Text>

          <View style={styles.objectiveItem}>
            <View style={styles.objIconBox}>
              <FontAwesome5 name="boxes" size={18} color={Colors.primary} />
            </View>
            <View style={styles.objTextContainer}>
              <Text style={styles.objTitle}>Controle de Estoque</Text>
              <Text style={styles.objDesc}>
                Monitoramento em tempo real da movimentação de produtos.
              </Text>
            </View>
          </View>

          <View style={styles.objectiveItem}>
            <View style={styles.objIconBox}>
              <MaterialIcons
                name="smartphone"
                size={22}
                color={Colors.primary}
              />
            </View>
            <View style={styles.objTextContainer}>
              <Text style={styles.objTitle}>Tecnologia NFC</Text>
              <Text style={styles.objDesc}>
                Identificação rápida e segura através de tags e leitores.
              </Text>
            </View>
          </View>

          <View style={styles.objectiveItem}>
            <View style={styles.objIconBox}>
              <MaterialIcons
                name="attach-money"
                size={22}
                color={Colors.primary}
              />
            </View>
            <View style={styles.objTextContainer}>
              <Text style={styles.objTitle}>Baixo Custo</Text>
              <Text style={styles.objDesc}>
                Solução acessível para pequenas e médias empresas com ESP32.
              </Text>
            </View>
          </View>

          <View style={styles.objectiveItem}>
            <View style={styles.objIconBox}>
              <FontAwesome6
                name="bolt-lightning"
                size={18}
                color={Colors.primary}
              />
            </View>
            <View style={styles.objTextContainer}>
              <Text style={styles.objTitle}>Automação</Text>
              <Text style={styles.objDesc}>
                Redução drástica de erros humanos e agilidade nos processos.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2025 CtrlStock. Todos os direitos reservados.
          </Text>
          <Text style={styles.footerNames}>
            Jefferson Kotoski, Murilo Pimentel
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
