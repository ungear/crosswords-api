import sqlite3 from "sqlite3";

async function initDb() {
  const db = new sqlite3.Database('crosswordsdb.sqlite');
  db.serialize(() => {
    db.run(`
      CREATE TABLE Words (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        Word TEXT NOT NULL,
        Answer TEXT NOT NULL,
        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );`);
  });

  db.close();
}

initDb();

