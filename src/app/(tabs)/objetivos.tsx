import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import ObjetivoCard from "../../components/ObjetivoCard";
import { useObjetivos } from "../../store/useObjetivos";

export default function Objetivos() {
  const { objetivos, cargar, agregar, eliminar } = useObjetivos();
  const [ modal, setModal ] = useState(false);
  const [ titulo, setTitulo ] = useState("");
  const [ descripcion, setDescripcion ] = useState("");

  // recarga cada vez que entras a la pestaña, para actualizar el progreso
  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [])
  );

  const guardar = async () => {
    if (!titulo.trim()) return;
    await agregar(titulo.trim(), descripcion.trim());
    setTitulo("");
    setDescripcion("");
    setModal(false);
  };

  return (
    <View style={styles.container}>
      <FlatList 
         data={objetivos}
         keyExtractor={(o) => String(o.id)}
         contentContainerStyle={{ padding: 16 }}
         ListEmptyComponent={
          <Text style={styles.vacio}> Aun no hay objetios. Toca + para crear uno. </Text>
         }
         renderItem={({ item }) => (
          <ObjetivoCard objetivo={item} onEliminar={() => eliminar(item.id)} />
         )}
      />

      <Pressable style={styles.fab} onPress={() => setModal(true)}>
        <Ionicons name="add" size={32} color="#fff" />
      </Pressable>

      <Modal visible={modal} transparent animationType="slide">
         <View style={styles.fondoModal}>
          <View style={styles.modal}>
            <Text style={styles.modalTitulo}>Nuevo objetivo</Text>
            <TextInput
              style={styles.input}
              placeholder="ej. aprender.... "
              value={titulo}
              onChangeText={setTitulo}
              autoFocus
            />
            <TextInput
              style={[styles.input, {marginTop: 10}]}
              placeholder="descripcion (opcional)"
              value={descripcion}
              onChangeText={setDescripcion}
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