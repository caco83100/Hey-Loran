// server.js

const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 4000;

// Middleware
app.use(cors()); // autorise ton React à communiquer avec le backend
app.use(bodyParser.json()); // pour parser les body en JSON

// Init DB
const db = new Database('heyloran.db');

// Crée la table menus si elle n'existe pas
db.prepare(`
  CREATE TABLE IF NOT EXISTS menus (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    moment TEXT,
    type TEXT,
    entreeNom TEXT,
    entreeIngredients TEXT,
    platNom TEXT,
    platIngredients TEXT,
    dessertNom TEXT,
    dessertIngredients TEXT,
    boissonNom TEXT,
    boissonIngredients TEXT,
    effectif INTEGER,
    commentaires TEXT
  )
`).run();


// GET /menus → avec option de filtre par date
app.get('/menus', (req, res) => {
  const { from, to } = req.query;

  let menus;
  if (from && to) {
    menus = db.prepare(`
      SELECT * FROM menus 
      WHERE date BETWEEN ? AND ? 
      ORDER BY date ASC, moment ASC
    `).all(from, to);
  } else {
    menus = db.prepare('SELECT * FROM menus ORDER BY date DESC').all();
  }

  res.json(menus);
});


// POST /menus → ajoute un menu
app.post('/menus', (req, res) => {
  const {
    date, moment, type,
    entreeNom, entreeIngredients,
    platNom, platIngredients,
    dessertNom, dessertIngredients,
    boissonNom, boissonIngredients,
    effectif,
    commentaires
  } = req.body;

  const stmt = db.prepare(`
    INSERT INTO menus
    (date, moment, type,
    entreeNom, entreeIngredients,
    platNom, platIngredients,
    dessertNom, dessertIngredients,
    boissonNom, boissonIngredients,
    effectif,
    commentaires)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const info = stmt.run(
    date, moment, type,
    entreeNom, entreeIngredients,
    platNom, platIngredients,
    dessertNom, dessertIngredients,
    boissonNom, boissonIngredients,
    effectif,
    commentaires
  );

  res.json({ success: true, id: info.lastInsertRowid });
});

// DELETE /menus/:id → supprime un menu
app.delete('/menus/:id', (req, res) => {
  const { id } = req.params;

  const stmt = db.prepare('DELETE FROM menus WHERE id = ?');
  const info = stmt.run(Number(id));


  if (info.changes > 0) {
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, message: 'Menu non trouvé' });
  }
});



// Démarre le serveur
app.listen(port, () => {
  console.log(`✅ HeyLoran Backend API running → http://localhost:${port}`);
});
