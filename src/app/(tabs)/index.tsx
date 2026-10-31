import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import TareaItem from "../../components/TareaItem";
import { useTareas } from "../../store/useTareas";
import { Prioridad, Tarea } from "../../types";
import { hoyISO } from "../../utils/fechas";

import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useObjetivos } from "../../store/useObjetivos";

const prioridades: Prioridad[] = ["alta", "media", "baja"];

export default function Hoy() {
  const { tareas, cargar, agregar, alternar, editar, eliminar } = useTareas();
  const [modal, setModal] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [prioridad, setPrioridad] = useState<Prioridad>("media");
  const [editando, setEditando] = useState<Tarea | null>(null);
  const { objetivos, cargar: cargarObjetivos } = useObjetivos();
  const [objetivoId, setObjetivoId] = useState<number | null>(null);

  useEffect(() => {
    cargar();
    cargarObjetivos();
  }, []);

  const hoy = hoyISO();
  const tareasHoy = tareas.filter((t) => t.fecha === hoy);
  const hechas = tareasHoy.filter((t) => t.completada).length;

  const abrirNueva = () => {
    setEditando(null);
    setTitulo("");
    setPrioridad("media");
    setObjetivoId(null);
    cargarObjetivos();
    setModal(true);
  };

  const abrirEditar = (t: Tarea) => {
    setEditando(t);
    setTitulo(t.titulo);
    setModal(true);
  };

  const guardar = async () => {
    if (!titulo.trim()) return;
    if (editando) {
      await editar(editando.id, titulo.trim());
    } else {
      await agregar(titulo.trim(), hoy, prioridad, objetivoId);
    }
    setModal(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.resumen}>
        {hechas} de {tareasHoy.length} completadas
      </Text>

      <FlatList
        data={tareasHoy}
        keyExtractor={(t) => String(t.id)}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <Text style={styles.vacio}>No tienes tareas para hoy. Toca + para agregar una.</Text>
        }
        renderItem={({ item }) => (
          <TareaItem
            tarea={item}
            onAlternar={() => alternar(item.id, !item.completada)}
            onEditar={() => abrirEditar(item)}
            onEliminar={() => eliminar(item.id)}
          />
        )}
      />

      <Pressable style={styles.fab} onPress={abrirNueva}>
        <Ionicons name="add" size={32} color="#fff" />
      </Pressable>

      <Modal visible={modal} transparent animationType="slide">
        <View style={styles.fondoModal}>
          <View style={styles.modal}>
            <Text style={styles.modalTitulo}>
              {editando ? "Editar tarea" : "Nueva tarea"}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="¿Qué tienes que hacer?"
              value={titulo}
              onChangeText={setTitulo}
              autoFocus
            />

            {!editando && (
              <>
                <View style={styles.prioridades}>
                  {prioridades.map((p) => (
                    <Pressable
                      key={p}
                      onPress={() => setPrioridad(p)}
                      style={[styles.chip, prioridad === p && styles.chipActivo]}
                    >
                      <Text style={prioridad === p ? styles.chipTextoActivo : undefined}>
                        {p}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                {objetivos.length > 0 && (
                  <>
                    <Text style={styles.etiqueta}>Vincular a un objetivo</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      <View style={{ flexDirection: "row", gap: 8 }}>
                        <Pressable
                          onPress={() => setObjetivoId(null)}
                          style={[styles.chip, objetivoId === null && styles.chipActivo]}
                        >
                          <Text style={objetivoId === null ? styles.chipTextoActivo : undefined}>
                            Ninguno
                          </Text>
                        </Pressable>
                        {objetivos.map((o) => (
                          <Pressable
                            key={o.id}
                            onPress={() => setObjetivoId(o.id)}
                            style={[styles.chip, objetivoId === o.id && styles.chipActivo]}
                          >
                            <Text style={objetivoId === o.id ? styles.chipTextoActivo : undefined}>
                              {o.titulo}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                    </ScrollView>
                  </>
                )}
              </>
            )}
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
  resumen: { textAlign: "center", paddingTop: 12, color: "#6b7280", fontSize: 14 },
  vacio: { textAlign: "center", color: "#9ca3af", marginTop: 40 },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#4f46e5",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  fondoModal: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modal: { backgroundColor: "#fff", padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  modalTitulo: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 10, padding: 12, fontSize: 16 },
  prioridades: { flexDirection: "row", gap: 8, marginTop: 14 },
  chip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: "#d1d5db" },
  chipActivo: { backgroundColor: "#4f46e5", borderColor: "#4f46e5" },
  chipTextoActivo: { color: "#fff" },
  botones: { flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 20, marginTop: 20 },
  cancelar: { color: "#6b7280", fontSize: 16 },
  guardar: { backgroundColor: "#4f46e5", paddingVertical: 10, paddingHorizontal: 22, borderRadius: 10 },
  guardarTexto: { color: "#fff", fontSize: 16, fontWeight: "600" },
  etiqueta: { marginTop: 16, marginBottom: 8, color: "#6b7280", fontSize: 13 },
});