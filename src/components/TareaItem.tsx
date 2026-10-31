import { Ionicons } from "@expo/vector-icons";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Tarea } from "../types";

const colores = { alta: "#ef4444", media: "#f59e0b", baja: "#22c55e" };

interface Props {
  tarea: Tarea;
  onAlternar: () => void;
  onEditar: () => void;
  onEliminar: () => void;
}

export default function TareaItem({ tarea, onAlternar, onEditar, onEliminar }: Props) {
  const confirmarBorrado = () => {
    Alert.alert("Eliminar tarea", `¿Eliminar "${tarea.titulo}"?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: onEliminar },
    ]);
  };

  return (
    <View style={styles.fila}>
      <View style={[styles.barra, { backgroundColor: colores[tarea.prioridad] }]} />
      <Pressable onPress={onAlternar} hitSlop={8}>
        <Ionicons
          name={tarea.completada ? "checkmark-circle" : "ellipse-outline"}
          size={28}
          color={tarea.completada ? "#22c55e" : "#9ca3af"}
        />
      </Pressable>
      <Pressable style={styles.textoWrap} onPress={onEditar}>
        <Text style={[styles.titulo, tarea.completada && styles.tachado]}>
          {tarea.titulo}
        </Text>
      </Pressable>
      <Pressable onPress={confirmarBorrado} hitSlop={8}>
        <Ionicons name="trash-outline" size={22} color="#ef4444" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    gap: 10,
    elevation: 1,
  },
  barra: { width: 4, alignSelf: "stretch", borderRadius: 2 },
  textoWrap: { flex: 1 },
  titulo: { fontSize: 16, color: "#111827" },
  tachado: { textDecorationLine: "line-through", color: "#9ca3af" },
});