export type Prioridad = "alta" | "media" | "baja";

export interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string; // formato YYYY-MM-DD
  prioridad: Prioridad;
  completada: boolean;
  objetivoId: number | null;
  creadaEn: string;
}
export interface Objetivo {
  id: number;
  titulo: string;
  descripcion: string;
  creadoEn: string; 
}

export interface ObjetivoProgreso extends Objetivo{
  total: number;
  hechas: number;
}

export interface Idea {
  id: number;
  titulo: string;
  contenido: string;
  etiquetas: string[];
  creadaEn: string;
}