import Database from 'better-sqlite3';

const db = new Database('career_os.db');
db.pragma('journal_mode = WAL');

// Initialize Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    branch TEXT,
    year TEXT,
    cgpa TEXT,
    interests TEXT,
    skills TEXT,
    career_goals TEXT,
    current_path TEXT,
    xp INTEGER DEFAULT 0,
    streaks INTEGER DEFAULT 0,
    badges TEXT DEFAULT '[]',
    last_login_date TEXT
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    date TEXT NOT NULL,
    xp_reward INTEGER DEFAULT 50,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    description TEXT,
    tech_stack TEXT,
    status TEXT DEFAULT 'planned',
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

export default db;
