import { create } from "zustand";
import {
  actualizarTitulo,
  alternarTarea,
  borrarTarea,
  crearTarea,
  obtenerTareas,
} from "../db/database";
import { Prioridad, Tarea } from "../types";

interface TareasState {
  tareas: Tarea[];
  cargar: () => Promise<void>;
  agregar: (titulo: string, fecha: string, prioridad: Prioridad, objetivoId: number | null) => Promise<void>;
  alternar: (id: number, completada: boolean) => Promise<void>;
  editar: (id: number, titulo: string) => Promise<void>;
  eliminar: (id: number) => Promise<void>;
}

export const useTareas = create<TareasState>((set, get) => ({
  tareas: [],
  cargar: async () => {
    set({ tareas: await obtenerTareas() });
  },
  agregar: async (titulo, fecha, prioridad, objetivoId = null) => {
    await crearTarea(titulo, fecha, prioridad, objetivoId);
    await get().cargar();
  },
  alternar: async (id, completada) => {
    await alternarTarea(id, completada);
    await get().cargar();
  },
  editar: async (id, titulo) => {
    await actualizarTitulo(id, titulo);
    await get().cargar();
  },
  eliminar: async (id) => {
    await borrarTarea(id);
    await get().cargar();
  },
}));