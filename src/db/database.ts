import * as SQLite from "expo-sqlite";
import { ObjetivoProgreso, Prioridad, Tarea } from "../types";

let db: SQLite.SQLiteDatabase | null = null;

async function getDb() {
  if (!db) {
    db = await SQLite.openDatabaseAsync("tareas.db");
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS tareas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        descripcion TEXT DEFAULT '',
        fecha TEXT NOT NULL,
        prioridad TEXT DEFAULT 'media',
        completada INTEGER DEFAULT 0,
        objetivoId INTEGER,
        creadaEn TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS objetivos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        descripcion TEXT DEFAULT '',
        creadoEn TEXT NOT NULL
      );
    `);
  }
  return db;
}

function mapTarea(row: any): Tarea {
  return { ...row, completada: row.completada === 1 };
}

export async function obtenerTareas(): Promise<Tarea[]> {
  const database = await getDb();
  const rows = await database.getAllAsync(
    "SELECT * FROM tareas ORDER BY completada ASC, fecha ASC, id DESC"
  );
  return rows.map(mapTarea);
}

export async function crearTarea(
  titulo: string,
  fecha: string,
  prioridad: Prioridad,
  objetivoId: number | null = null
) {
  const database = await getDb();
  await database.runAsync(
    "INSERT INTO tareas (titulo, fecha, prioridad, objetivoId, creadaEn) VALUES (?, ?, ?, ?, ?)",
    [titulo, fecha, prioridad, objetivoId, new Date().toISOString()]
  );
}

export async function alternarTarea(id: number, completada: boolean) {
  const database = await getDb();
  await database.runAsync("UPDATE tareas SET completada = ? WHERE id = ?", [
    completada ? 1 : 0,
    id,
  ]);
}

export async function actualizarTitulo(id: number, titulo: string) {
  const database = await getDb();
  await database.runAsync("UPDATE tareas SET titulo = ? WHERE id = ?", [
    titulo,
    id,
  ]);
}

export async function borrarTarea(id: number) {
  const database = await getDb();
  await database.runAsync("DELETE FROM tareas WHERE id = ?", [id]);
}

export async function obtenerObjetivos(): Promise<ObjetivoProgreso[]> {
  const database = await getDb();
  return await database.getAllAsync<ObjetivoProgreso>(`
    SELECT o.*,
           COUNT(t.id) AS total,
           COALESCE(SUM(t.completada), 0) AS hechas
    FROM objetivos o
    LEFT JOIN tareas t ON t.objetivoId = o.id
    GROUP BY o.id
    ORDER BY o.id DESC
  `);
}

export async function crearObjetivo(titulo: string, descripcion: string) {
  const database = await getDb();
  await database.runAsync(
    "INSERT INTO objetivos (titulo, descripcion, creadoEn) VALUES (?, ?, ?)",
    [titulo, descripcion, new Date().toISOString()]
  );
}

export async function borrarObjetivo(id: number) {
  const database = await getDb();
  await database.runAsync("UPDATE tareas SET objetivoId = NULL WHERE objetivoId = ?", [id]);
  await database.runAsync("DELETE FROM objetivos WHERE id = ?", [id]);
}