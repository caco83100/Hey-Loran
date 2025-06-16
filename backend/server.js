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
    residents TEXT,
    service_id INTEGER
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

// Crée la table services
db.prepare(`
  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    moment TEXT NOT NULL,
    UNIQUE(date, moment)
  )
`).run();

// Crée les tables de traçabilité
db.prepare(`
  CREATE TABLE IF NOT EXISTS cahier_chaine (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_id INTEGER,
    heure_debut TEXT,
    heure_fin TEXT,
    temperature_plats_chauds TEXT,
    temperature_plats_froids TEXT,
    observations TEXT,
    signature TEXT
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS mixes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_id INTEGER,
    produit TEXT,
    temperature_preparation TEXT,
    temperature_service TEXT,
    heure TEXT,
    observations TEXT,
    signature TEXT
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS refroidissement_remise (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_id INTEGER,
    produit TEXT,
    quantite TEXT,
    temperature_initiale TEXT,
    heure_debut TEXT,
    heure_fin TEXT,
    temperature_finale TEXT,
    observations TEXT,
    signature TEXT
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS controle_reception (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date_reception TEXT,
    produit TEXT,
    temperature_reception TEXT,
    etat_emballage TEXT,
    dlc TEXT,
    conformite TEXT,
    observations TEXT,
    signature TEXT
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS temperature_equipements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    equipement TEXT,
    temperature TEXT,
    observations TEXT,
    signature TEXT
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS affichage_config (
    id INTEGER PRIMARY KEY,
    date TEXT NOT NULL,
    moment TEXT NOT NULL
  )
`).run();


// ------------------------------------------------------------
// ROUTES MENUS
// ------------------------------------------------------------

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

app.post('/menus', (req, res) => {
  const {
    date, moment, type,
    entreeNom, entreeIngredients,
    platNom, platIngredients,
    dessertNom, dessertIngredients,
    boissonNom, boissonIngredients,
    effectif,
    commentaires,
    residents,
    service_id
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
      residents,
      service_id
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    service_id
  );

  res.json({ success: true, id: info.lastInsertRowid });
});

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
    residents,
    service_id
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
      residents = ?,
      service_id = ?
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
    service_id,
    Number(id)
  );

  if (info.changes > 0) {
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, message: 'Menu non trouvé' });
  }
});

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

// ------------------------------------------------------------
// ROUTES SERVICES
// ------------------------------------------------------------

// POST /services → crée ou récupère un service existant
app.post('/services', (req, res) => {
  const { date, moment } = req.body;

  const existing = db.prepare('SELECT id FROM services WHERE date = ? AND moment = ?').get(date, moment);

  if (existing) {
    res.json({ success: true, id: existing.id });
  } else {
    const stmt = db.prepare('INSERT INTO services (date, moment) VALUES (?, ?)');
    const info = stmt.run(date, moment);
    res.json({ success: true, id: info.lastInsertRowid });
  }
});

// GET /services → filtre par ?date et/ou ?moment
app.get('/services', (req, res) => {
  const { date, moment } = req.query;

  if (date && moment) {
    const service = db.prepare('SELECT * FROM services WHERE date = ? AND moment = ?').get(date, moment);
    if (service) {
      res.json([service]);
    } else {
      res.json([]);
    }
  } else if (date) {
    const services = db.prepare('SELECT * FROM services WHERE date = ? ORDER BY moment ASC').all(date);
    res.json(services);
  } else {
    const services = db.prepare('SELECT * FROM services ORDER BY date DESC, moment ASC').all();
    res.json(services);
  }
});

// ------------------------------------------------------------
// ROUTES RESIDENTS
// ------------------------------------------------------------

app.get('/residents', (req, res) => {
  const residents = db.prepare('SELECT * FROM residents ORDER BY nom ASC, prenom ASC').all();
  res.json(residents);
});

app.post('/residents', (req, res) => {
  const { nom, prenom, aversion } = req.body;

  const stmt = db.prepare(`
    INSERT INTO residents (nom, prenom, aversion)
    VALUES (?, ?, ?)
  `);

  const info = stmt.run(nom, prenom, aversion);
  res.json({ success: true, id: info.lastInsertRowid });
});

app.delete('/residents/:id', (req, res) => {
  const { id } = req.params;

  const stmt = db.prepare('DELETE FROM residents WHERE id = ?');
  const info = stmt.run(Number(id));

  if (info.changes > 0) {
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, message: 'Résident non trouvé' });
  }
});

// ------------------------------------------------------------
// ROUTE AFFICHAGE CUISINE
// ------------------------------------------------------------

app.get('/affichage-cuisine', (req, res) => {
  const { date, moment } = req.query;

  console.log(`--> GET /affichage-cuisine : date=${date} | moment=${moment}`);

  if (!date || !moment) {
    return res.status(400).json({ success: false, message: 'Paramètres manquants (date, moment)' });
  }

  const service = db.prepare('SELECT * FROM services WHERE date = ? AND moment = ?').get(date, moment);

  if (!service) {
    return res.json({ success: true, serviceFound: false });
  }

  const menus = db.prepare('SELECT * FROM menus WHERE service_id = ?').all(service.id);

  const residentsSet = new Set();
  menus.forEach(menu => {
    if (menu.residents) {
      try {
        const resIds = JSON.parse(menu.residents);
        resIds.forEach(id => residentsSet.add(id));
      } catch (err) {
        console.error('Erreur parsing residents:', err);
      }
    }
  });

  const residents = Array.from(residentsSet).map(id => {
    return db.prepare('SELECT * FROM residents WHERE id = ?').get(id);
  }).filter(r => r);

  res.json({
    success: true,
    serviceFound: true,
    service_id: service.id,
    date: service.date,
    moment: service.moment,
    menus: menus,
    residents: residents,
  });
});

// Récupérer la config actuelle
app.get('/affichage-config', (req, res) => {
  const config = db.prepare('SELECT * FROM affichage_config WHERE id = 1').get();
  if (config) {
    res.json({ success: true, config });
  } else {
    res.json({ success: false, message: 'Aucune configuration trouvée.' });
  }
});

// Définir / mettre à jour la config
app.post('/affichage-config', (req, res) => {
  const { date, moment } = req.body;

  const exists = db.prepare('SELECT * FROM affichage_config WHERE id = 1').get();
  if (exists) {
    db.prepare('UPDATE affichage_config SET date = ?, moment = ? WHERE id = 1').run(date, moment);
  } else {
    db.prepare('INSERT INTO affichage_config (id, date, moment) VALUES (1, ?, ?)').run(date, moment);
  }

  res.json({ success: true });
});


// ------------------------------------------------------------

app.listen(port, () => {
  console.log(`✅ HeyLoran Backend API running → http://localhost:${port}`);
});
