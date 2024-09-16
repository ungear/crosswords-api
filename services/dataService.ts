import sqlite3 from 'sqlite3';

const DB_PATH = './db/crosswordsdb.sqlite';

export function addWord(word: string, answer: string) {
  const db = new sqlite3.Database(DB_PATH);
  db.serialize(() => {
    db.run(`INSERT INTO Words (Word, Answer) VALUES (?, ?)`, [word, answer]);
  });
  db.close();
}

export function getWords() {
  const result = new Promise((resolve, reject) => {
    try {
      const db = new sqlite3.Database(DB_PATH);
      db.serialize(() => {
      db.all(`SELECT * FROM Words`, (err, rows) => {
        resolve(rows)
      });
    });
      db.close();
    } catch (err) {
      reject(err);
    }
  })
  return result;
}