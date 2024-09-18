import fs from 'fs';

export async function loadWords() {
  const wordsPerPack = 10;
  const words = fs.readFileSync('words.txt', 'utf8').split("\r\n");

  while(words.length) {
    const pack = words.splice(0, wordsPerPack);
    const response = await fetch('http://localhost:3000/words', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ words: pack }),
    });

    console.log(response.status + ' ' + JSON.stringify(pack));
  }
}

loadWords();