import { Ionicons } from "@expo/vector-icons";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { ObjetivoProgreso } from "../types";

interface Props {
  objetivo: ObjetivoProgreso;
  onEliminar: () => void;
}

export default function ObjetivoCard({ objetivo, onEliminar }: Props) {
  const porcentaje =
    objetivo.total === 0 ? 0 : Math.round((objetivo.hechas / objetivo.total) * 100);

  const confirmar = () => {
    Alert.alert(
      "Eliminar objetivo",
      `¿Eliminar "${objetivo.titulo}"? Sus tareas se conservarán sin objetivo.`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: onEliminar },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.encabezado}>
        <Text style={styles.titulo}>{objetivo.titulo}</Text>
        <Pressable onPress={confirmar} hitSlop={8}>
          <Ionicons name="trash-outline" size={22} color="#ef4444" />
        </Pressable>
      </View>

      {!!objetivo.descripcion && (
        <Text style={styles.descripcion}>{objetivo.descripcion}</Text>
      )}

      <View style={styles.barraFondo}>
        <View style={[styles.barraRelleno, { width: `${porcentaje}%` }]} />
      </View>

      <Text style={styles.progreso}>
        {objetivo.total === 0
          ? "Sin tareas vinculadas"
          : `${objetivo.hechas} de ${objetivo.total} tareas · ${porcentaje}%`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
  },
  encabezado: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  titulo: { fontSize: 17, fontWeight: "600", color: "#111827", flex: 1, marginRight: 8 },
  descripcion: { color: "#6b7280", marginTop: 4 },
  barraFondo: { height: 8, backgroundColor: "#e5e7eb", borderRadius: 4, marginTop: 12, overflow: "hidden" },
  barraRelleno: { height: 8, backgroundColor: "#4f46e5", borderRadius: 4 },
  progreso: { marginTop: 8, fontSize: 13, color: "#6b7280" },
});