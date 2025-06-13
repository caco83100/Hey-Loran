const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

// Init DB
const db = new Database('heyloran.db');

// Crée la table menus
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
    commentaires TEXT,
    residents TEXT -- ici on ajoute bien le champ residents
  )
`).run();

// Crée la table residents
db.prepare(`
  CREATE TABLE IF NOT EXISTS residents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT,
    prenom TEXT,
    aversion TEXT
  )
`).run();

// GET /menus → liste menus avec filtre dates
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

  res.json(menus.map(menu => ({
    ...menu,
    residents: menu.residents ? JSON.parse(menu.residents) : []
  })));
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
    commentaires,
    residents
  } = req.body;

  const stmt = db.prepare(`
    INSERT INTO menus (
      date, moment, type,
      entreeNom, entreeIngredients,
      platNom, platIngredients,
      dessertNom, dessertIngredients,
      boissonNom, boissonIngredients,
      effectif,
      commentaires,
      residents
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const info = stmt.run(
    date, moment, type,
    entreeNom, entreeIngredients,
    platNom, platIngredients,
    dessertNom, dessertIngredients,
    boissonNom, boissonIngredients,
    effectif,
    commentaires,
    JSON.stringify(residents)
  );

  res.json({ success: true, id: info.lastInsertRowid });
});

// PUT /menus/:id → modifie un menu existant
app.put('/menus/:id', (req, res) => {
  const { id } = req.params;
  const {
    date, moment, type,
    entreeNom, entreeIngredients,
    platNom, platIngredients,
    dessertNom, dessertIngredients,
    boissonNom, boissonIngredients,
    effectif,
    commentaires,
    residents
  } = req.body;

  const stmt = db.prepare(`
    UPDATE menus SET
      date = ?,
      moment = ?,
      type = ?,
      entreeNom = ?,
      entreeIngredients = ?,
      platNom = ?,
      platIngredients = ?,
      dessertNom = ?,
      dessertIngredients = ?,
      boissonNom = ?,
      boissonIngredients = ?,
      effectif = ?,
      commentaires = ?,
      residents = ?
    WHERE id = ?
  `);

  const info = stmt.run(
    date, moment, type,
    entreeNom, entreeIngredients,
    platNom, platIngredients,
    dessertNom, dessertIngredients,
    boissonNom, boissonIngredients,
    effectif,
    commentaires,
    JSON.stringify(residents),
    Number(id)
  );

  if (info.changes > 0) {
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, message: 'Menu non trouvé' });
  }
});


// DELETE /menus/:id
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

// GET /residents
app.get('/residents', (req, res) => {
  const residents = db.prepare('SELECT * FROM residents ORDER BY nom ASC, prenom ASC').all();
  res.json(residents);
});

// POST /residents
app.post('/residents', (req, res) => {
  const { nom, prenom, aversion } = req.body;

  const stmt = db.prepare(`
    INSERT INTO residents (nom, prenom, aversion)
    VALUES (?, ?, ?)
  `);

  const info = stmt.run(nom, prenom, aversion);
  res.json({ success: true, id: info.lastInsertRowid });
});

app.listen(port, () => {
  console.log(`✅ HeyLoran Backend API running → http://localhost:${port}`);
});
