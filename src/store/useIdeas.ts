import { create } from "zustand";
import { borrarIdea, crearIdea, obtenerIdeas } from "../db/database";
import { Idea } from "../types";

interface IdeasState {
  ideas: Idea[];
  cargar: () => Promise<void>;
  agregar: (titulo: string, contenido: string, etiquetas: string[]) => Promise<void>;
  eliminar: (id: number) => Promise<void>;
}

export const useIdeas = create<IdeasState>((set, get) => ({
  ideas: [],
  cargar: async () => {
    set({ ideas: await obtenerIdeas() });
  },
  agregar: async (titulo, contenido, etiquetas) => {
    await crearIdea(titulo, contenido, etiquetas);
    await get().cargar();
  },
  eliminar: async (id) => {
    await borrarIdea(id);
    await get().cargar();
  },
}));