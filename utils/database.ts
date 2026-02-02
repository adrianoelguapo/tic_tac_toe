import * as SQLite from "expo-sqlite";

export interface Score {

  id?: number;
  name: string;
  mode: "easy" | "hard";
  time: number; 

}

let db: SQLite.SQLiteDatabase | null = null;

/* --- Iniciar base de datos --- */
export const initDatabase = async (): Promise<void> => {

  db = await SQLite.openDatabaseAsync("buzzboard.db");

  await db.execAsync(`CREATE TABLE IF NOT EXISTS scores (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, mode TEXT NOT NULL, time INTEGER NOT NULL);`);

};

/* --- Guardar una puntuación --- */
export const saveScore = async (score: Score): Promise<void> => {

  if (!db) await initDatabase();

  await db!.runAsync("INSERT INTO scores (name, mode, time) VALUES (?, ?, ?)", [score.name, score.mode, score.time]);

};

/* --- Obtener puntuaciones por modo --- */
export const getScoresByMode = async (mode: "easy" | "hard") : Promise<Score[]> => {

  if (!db) await initDatabase();

  const result = await db!.getAllAsync<Score>("SELECT id, name, mode, time FROM scores WHERE mode = ? ORDER BY time ASC", [mode]);

  return result;

};

/* --- Obtener todas las puntuaciones --- */
export const getAllScores = async (): Promise<{easy: Score[]; hard: Score[]}> => {

  const easy = await getScoresByMode("easy");
  const hard = await getScoresByMode("hard");

  return { easy, hard };

};

/* --- Formatear campo time que son segundos a mm:ss --- */
export const formatTime = (seconds: number): string => {

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

};