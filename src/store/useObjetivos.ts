import { create } from "zustand";
import { borrarObjetivo, crearObjetivo, obtenerObjetivos } from "../db/database";
import { ObjetivoProgreso } from "../types";

interface ObjetivosState {
    objetivos: ObjetivoProgreso[];
    cargar: () => Promise<void>;
    agregar: (titulo: string, descripcion: string) => Promise<void>;
    eliminar: (id: number) => Promise<void>;
}

export const useObjetivos = create<ObjetivosState>((set, get) => ({
    objetivos: [],
    cargar: async () => {
        set({ objetivos: await obtenerObjetivos() });
    },
    agregar: async (titulo, descripcion) => {
        await crearObjetivo(titulo, descripcion);
        await get().cargar();
    },
    eliminar: async (id) => {
        await borrarObjetivo(id);
        await get().cargar();
    }
}));