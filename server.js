const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const SCORES_FILE = path.join(__dirname, 'scores.json');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// GET - Récupère tous les scores
app.get('/scores/scores.json', (req, res) => {
  if (fs.existsSync(SCORES_FILE)) {
    const scores = JSON.parse(fs.readFileSync(SCORES_FILE, 'utf8'));
    res.json(scores);
  } else {
    res.json([]);
  }
});

// POST - Ajoute un nouveau score
app.post('/scores/scores.json', (req, res) => {
  let scores = [];
  
  if (fs.existsSync(SCORES_FILE)) {
    scores = JSON.parse(fs.readFileSync(SCORES_FILE, 'utf8'));
  }
  
  // Ajoute le nouveau score
  scores.push(req.body);
  
  // Trie par score décroissant
  scores.sort((a, b) => b.score - a.score);
  
  // Garde top 100
  scores = scores.slice(0, 100);
  
  // Sauvegarde
  fs.writeFileSync(SCORES_FILE, JSON.stringify(scores, null, 2));
  
  res.json({ success: true, message: 'Score saved!' });
});

app.listen(PORT, () => {
  console.log(`🎮 Server running at http://localhost:${PORT}`);
  console.log(`📊 Scores saved to ${SCORES_FILE}`);
});
