import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import IdeaCard from "../../components/IdeaCard";
import { useIdeas } from "../../store/useIdeas";
import { useObjetivos } from "../../store/useObjetivos";
import { useTareas } from "../../store/useTareas";
import { Idea } from "../../types";
import { hoyISO } from "../../utils/fechas";

export default function Ideas() {
  const { ideas, cargar, agregar, eliminar } = useIdeas();
  const { agregar: agregarTarea } = useTareas();
  const { agregar: agregarObjetivo } = useObjetivos();

  const [modal, setModal] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [etiquetasTexto, setEtiquetasTexto] = useState("");
  const [filtro, setFiltro] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [])
  );

  const todasEtiquetas = Array.from(new Set(ideas.flatMap((i) => i.etiquetas)));
  const ideasVisibles = filtro ? ideas.filter((i) => i.etiquetas.includes(filtro)) : ideas;

  const guardar = async () => {
    if (!titulo.trim()) return;
    const etiquetas = Array.from(
      new Set(
        etiquetasTexto
          .split(",")
          .map((e) => e.trim().toLowerCase())
          .filter((e) => e.length > 0)
      )
    );
    await agregar(titulo.trim(), contenido.trim(), etiquetas);
    setTitulo("");
    setContenido("");
    setEtiquetasTexto("");
    setModal(false);
  };

  const convertir = (idea: Idea) => {
    Alert.alert(`"${idea.titulo}"`, "¿Qué quieres hacer con esta idea?", [
      {
        text: "Convertir en tarea",
        onPress: async () => {
          await agregarTarea(idea.titulo, hoyISO(), "media");
          await eliminar(idea.id);
        },
      },
      {
        text: "Convertir en objetivo",
        onPress: async () => {
          await agregarObjetivo(idea.titulo, idea.contenido);
          await eliminar(idea.id);
        },
      },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  return (
    <View style={styles.container}>
      {todasEtiquetas.length > 0 && (
        <View style={styles.filtros}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: "row", gap: 8, paddingHorizontal: 16 }}>
              <Pressable
                onPress={() => setFiltro(null)}
                style={[styles.chip, filtro === null && styles.chipActivo]}
              >
                <Text style={filtro === null ? styles.chipTextoActivo : undefined}>Todas</Text>
              </Pressable>
              {todasEtiquetas.map((e) => (
                <Pressable
                  key={e}
                  onPress={() => setFiltro(e)}
                  style={[styles.chip, filtro === e && styles.chipActivo]}
                >
                  <Text style={filtro === e ? styles.chipTextoActivo : undefined}>#{e}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      <FlatList
        data={ideasVisibles}
        keyExtractor={(i) => String(i.id)}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <Text style={styles.vacio}>Aún no tienes ideas. Toca + para anotar una.</Text>
        }
        renderItem={({ item }) => (
          <IdeaCard
            idea={item}
            onConvertir={() => convertir(item)}
            onEliminar={() => eliminar(item.id)}
          />
        )}
      />

      <Pressable style={styles.fab} onPress={() => setModal(true)}>
        <Ionicons name="add" size={32} color="#fff" />
      </Pressable>

      <Modal visible={modal} transparent animationType="slide">
        <View style={styles.fondoModal}>
          <View style={styles.modal}>
            <Text style={styles.modalTitulo}>Nueva idea</Text>
            <TextInput
              style={styles.input}
              placeholder="Título de la idea"
              value={titulo}
              onChangeText={setTitulo}
              autoFocus
            />
            <TextInput
              style={[styles.input, { marginTop: 10, height: 90, textAlignVertical: "top" }]}
              placeholder="Detalles (opcional)"
              value={contenido}
              onChangeText={setContenido}
              multiline
            />
            <TextInput
              style={[styles.input, { marginTop: 10 }]}
              placeholder="Etiquetas separadas por coma (ej: trabajo, app)"
              value={etiquetasTexto}
              onChangeText={setEtiquetasTexto}
              autoCapitalize="none"
            />
            <View style={styles.botones}>
              <Pressable onPress={() => setModal(false)}>
                <Text style={styles.cancelar}>Cancelar</Text>
              </Pressable>
              <Pressable style={styles.guardar} onPress={guardar}>
                <Text style={styles.guardarTexto}>Guardar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  filtros: { paddingTop: 12 },
  chip: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: "#d1d5db", backgroundColor: "#fff" },
  chipActivo: { backgroundColor: "#4f46e5", borderColor: "#4f46e5" },
  chipTextoActivo: { color: "#fff" },
  vacio: { textAlign: "center", color: "#9ca3af", marginTop: 40 },
  fab: {
    position: "absolute", right: 20, bottom: 20, width: 58, height: 58,
    borderRadius: 29, backgroundColor: "#4f46e5", alignItems: "center",
    justifyContent: "center", elevation: 5,
  },
  fondoModal: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modal: { backgroundColor: "#fff", padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  modalTitulo: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 10, padding: 12, fontSize: 16 },
  botones: { flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 20, marginTop: 20 },
  cancelar: { color: "#6b7280", fontSize: 16 },
  guardar: { backgroundColor: "#4f46e5", paddingVertical: 10, paddingHorizontal: 22, borderRadius: 10 },
  guardarTexto: { color: "#fff", fontSize: 16, fontWeight: "600" },
});