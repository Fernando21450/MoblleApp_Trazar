import { Ionicons } from "@expo/vector-icons";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Idea } from "../types";

interface Props {
  idea: Idea;
  onConvertir: () => void;
  onEliminar: () => void;
}

export default function IdeaCard({ idea, onConvertir, onEliminar }: Props) {
  const confirmar = () => {
    Alert.alert("Eliminar idea", `¿Eliminar "${idea.titulo}"?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: onEliminar },
    ]);
  };

  return (
    <Pressable style={styles.card} onPress={onConvertir}>
      <View style={styles.encabezado}>
        <Text style={styles.titulo}>{idea.titulo}</Text>
        <Pressable onPress={confirmar} hitSlop={8}>
          <Ionicons name="trash-outline" size={22} color="#ef4444" />
        </Pressable>
      </View>

      {!!idea.contenido && (
        <Text style={styles.contenido} numberOfLines={4}>
          {idea.contenido}
        </Text>
      )}

      {idea.etiquetas.length > 0 && (
        <View style={styles.etiquetas}>
          {idea.etiquetas.map((e) => (
            <View key={e} style={styles.etiqueta}>
              <Text style={styles.etiquetaTexto}>#{e}</Text>
            </View>
          ))}
        </View>
      )}
    </Pressable>
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
  contenido: { color: "#4b5563", marginTop: 6, lineHeight: 20 },
  etiquetas: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 10 },
  etiqueta: { backgroundColor: "#eef2ff", paddingVertical: 3, paddingHorizontal: 10, borderRadius: 12 },
  etiquetaTexto: { color: "#4f46e5", fontSize: 12 },
});