/**
 * @file database.ts
 * @description Configuración e inicialización de la base de datos SQLite usando sql.js.
 *
 * Se usa sql.js en lugar de better-sqlite3 porque sql.js es WebAssembly puro
 * y no requiere compilación nativa — funciona en Windows sin Python ni Build Tools.
 *
 * Estrategia de persistencia:
 *  - Al arrancar, se carga el archivo .db del disco si existe, o se crea uno nuevo.
 *  - Después de cada escritura se llama a persistDb() para guardar cambios en disco.
 *  - Esto simula el comportamiento de una base de datos tradicional con archivo persistente.
 */

import initSqlJs, { Database } from 'sql.js';
import * as fs from 'fs';
import * as path from 'path';

/** Ruta al archivo físico de la base de datos SQLite */
const DB_PATH = path.join(__dirname, '../../appointments.db');

/** Instancia global de la base de datos (singleton) */
let db: Database;

/**
 * Inicializa sql.js y prepara la base de datos.
 * Crea las tablas si no existen.
 * Debe llamarse una sola vez al arrancar el servidor (en app.ts).
 *
 * @returns Promesa que resuelve con la instancia de la base de datos lista
 */
export const initDatabase = async (): Promise<Database> => {
  // Carga el motor WASM de SQLite
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    // Si ya existe un archivo .db, lo cargamos desde disco
    db = new SQL.Database(fs.readFileSync(DB_PATH));
  } else {
    // Primera ejecución: creamos una base de datos vacía en memoria
    db = new SQL.Database();
  }

  // Creación de tablas con restricciones y relaciones entre entidades
  db.run(`
    -- Tabla de áreas médicas (Ej: Cardiología, Pediatría)
    CREATE TABLE IF NOT EXISTS areas (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL UNIQUE,
      description TEXT,
      color       TEXT DEFAULT '#00d2c8',
      createdAt   TEXT NOT NULL
    );

    -- Tabla de doctores con referencia al área
    CREATE TABLE IF NOT EXISTS doctors (
      id        TEXT PRIMARY KEY,
      name      TEXT NOT NULL,
      specialty TEXT NOT NULL,
      areaId    TEXT,
      phone     TEXT,
      email     TEXT,
      status    TEXT DEFAULT 'activo',
      createdAt TEXT NOT NULL,
      FOREIGN KEY (areaId) REFERENCES areas(id)
    );

    -- Tabla de pacientes con datos personales completos
    CREATE TABLE IF NOT EXISTS patients (
      id        TEXT PRIMARY KEY,
      name      TEXT NOT NULL,
      dni       TEXT,
      phone     TEXT,
      email     TEXT,
      birthDate TEXT,
      gender    TEXT,
      address   TEXT,
      createdAt TEXT NOT NULL
    );

    -- Tabla de citas con FK a paciente, doctor y área
    CREATE TABLE IF NOT EXISTS appointments (
      id              TEXT PRIMARY KEY,
      patientId       TEXT NOT NULL,
      doctorId        TEXT NOT NULL,
      areaId          TEXT,
      appointmentDate TEXT NOT NULL,
      reason          TEXT NOT NULL,
      status          TEXT NOT NULL DEFAULT 'pendiente',
      notes           TEXT,
      createdAt       TEXT NOT NULL,
      FOREIGN KEY (patientId) REFERENCES patients(id),
      FOREIGN KEY (doctorId)  REFERENCES doctors(id),
      FOREIGN KEY (areaId)    REFERENCES areas(id)
    );
  `);

  // Guardamos el estado inicial en disco
  persistDb();
  return db;
};

/**
 * Serializa la base de datos en memoria y la escribe en el archivo físico.
 * Debe llamarse después de cada operación INSERT, UPDATE o DELETE.
 */
export const persistDb = (): void => {
  if (!db) return;
  const data = db.export(); // Exporta como Uint8Array
  fs.writeFileSync(DB_PATH, Buffer.from(data));
};

/**
 * Retorna la instancia activa de la base de datos.
 * Lanza un error si se llama antes de initDatabase().
 *
 * @throws Error si la base de datos no fue inicializada
 */
export const getDb = (): Database => {
  if (!db) throw new Error('Base de datos no inicializada. Llama initDatabase() primero.');
  return db;
};
