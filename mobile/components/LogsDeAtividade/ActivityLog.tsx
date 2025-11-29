import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Text, View } from "react-native";
import { styles } from "./_ActivityLogStyles";

import { LogItemProps } from "../../types/LogTypes";

export default function ActivityLog({
  type,
  item,
  quantity,
  timestamp,
}: LogItemProps) {
  const isEntry = type === "IN";
  const actionColor = isEntry ? "#397449" : "#BC4242";
  const actionIcon = isEntry ? "arrow-up" : "arrow-down";

  return (
    <View style={styles.logCard}>
      <View style={[styles.iconWrapper, { backgroundColor: actionColor }]}>
        <FontAwesome5 name={actionIcon} size={16} color="white" />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.logText}>
          <Text style={[styles.quantityText, { color: actionColor }]}>
            {isEntry ? "+" : "-"} {quantity}
          </Text>{" "}
          {item}
        </Text>
        <Text style={styles.timestampText}>{timestamp}</Text>
      </View>

      <View style={styles.rightInfo}>
        <Text style={[styles.statusTag, { backgroundColor: actionColor }]}>
          {isEntry ? "ENTRADA" : "SAÍDA"}
        </Text>
      </View>
    </View>
  );
}
