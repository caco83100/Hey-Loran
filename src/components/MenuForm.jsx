import { useState, useEffect } from 'react';
import '../style/MenuForm.css';

function MenuForm({ mode, initialMenuData, defaultDate, defaultMoment, onClose }) {
  const [menu, setMenu] = useState({
    date: defaultDate || '',
    moment: defaultMoment || 'Déjeuner',
    type: '',
    entreeNom: '',
    entreeIngredients: '',
    platNom: '',
    platIngredients: '',
    dessertNom: '',
    dessertIngredients: '',
    boissonNom: '',
    boissonIngredients: '',
    commentaires: '',
  });

  const [allResidents, setAllResidents] = useState([]);
  const [residentSearch, setResidentSearch] = useState('');
  const [selectedResidents, setSelectedResidents] = useState([]); // tableau de residents sélectionnés

  useEffect(() => {
    if (mode === 'edit' && initialMenuData) {
      setMenu({
        date: initialMenuData.date,
        moment: initialMenuData.moment,
        type: initialMenuData.type,
        entreeNom: initialMenuData.entreeNom,
        entreeIngredients: initialMenuData.entreeIngredients,
        platNom: initialMenuData.platNom,
        platIngredients: initialMenuData.platIngredients,
        dessertNom: initialMenuData.dessertNom,
        dessertIngredients: initialMenuData.dessertIngredients,
        boissonNom: initialMenuData.boissonNom,
        boissonIngredients: initialMenuData.boissonIngredients,
        commentaires: initialMenuData.commentaires,
      });
    } else if (mode === 'add') {
      setMenu((prev) => ({
        ...prev,
        date: defaultDate || '',
        moment: defaultMoment || 'Déjeuner',
      }));
      setSelectedResidents([]);
    }
  }, [mode, initialMenuData, defaultDate, defaultMoment]);

  // Chargement des residents
  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const response = await fetch('http://localhost:4000/residents');
        const data = await response.json();
        setAllResidents(data);
      } catch (error) {
        console.error('Erreur lors du chargement des résidents:', error);
      }
    };

    fetchResidents();
  }, []);

  // Synchronisation des residents en mode edit
  useEffect(() => {
    if (mode === 'edit' && initialMenuData && allResidents.length > 0) {
      if (initialMenuData.residents && Array.isArray(initialMenuData.residents)) {
        const selected = allResidents.filter(r => initialMenuData.residents.includes(r.id));
        setSelectedResidents(selected);
      } else {
        setSelectedResidents([]);
      }
    }
  }, [mode, initialMenuData, allResidents]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenu((prevMenu) => ({
      ...prevMenu,
      [name]: value,
    }));
  };

  const saveMenu = async (menuData) => {
  try {
    let response;

    if (mode === 'edit' && initialMenuData && initialMenuData.id) {
      // mode édition → PUT
      response = await fetch(`http://localhost:4000/menus/${initialMenuData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menuData),
      });
    } else {
      // mode ajout → POST
      response = await fetch('http://localhost:4000/menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menuData),
      });
    }

    const data = await response.json();

    if (data.success) {
      console.log(mode === 'edit'
        ? `Menu modifié (id=${initialMenuData.id})`
        : `Menu sauvegardé avec l'ID ${data.id}`);
    } else {
      console.error('Erreur lors de la sauvegarde du menu');
    }
  } catch (error) {
    console.error('Erreur réseau lors de la sauvegarde du menu:', error);
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!menu.date || !menu.type || !menu.platNom) {
      alert('Merci de remplir au minimum la date, le type de menu et le plat principal.');
      return;
    }

    await saveMenu({
      ...menu,
      residents: selectedResidents.map(r => r.id),
      effectif: selectedResidents.length,
    });

    alert('Menu sauvegardé en BDD !');

    onClose(); // on ferme le modal après save
  };

  return (
    <form onSubmit={handleSubmit} className="menu-form">
      <h2>{mode === 'add' ? 'Ajouter un menu' : 'Modifier le menu'}</h2>

      {/* Bloc 1 : Détails du service */}
      <fieldset>
        <legend>Détails du service</legend>
        <label>Date du service :</label>
        <input type="date" name="date" value={menu.date} onChange={handleChange} required />

        <label>Moment du service :</label>
        <select name="moment" value={menu.moment} onChange={handleChange}>
          <option>Petit Déjeuner</option>
          <option>Déjeuner</option>
          <option>Dîner</option>
        </select>

        <label>Type de menu (Texture) :</label>
        <input type="text" name="type" value={menu.type} onChange={handleChange} required />
      </fieldset>

      {/* Bloc 2 : Composition du menu */}
      <fieldset>
        <legend>Composition du menu</legend>

        <div className="menu-grid">
          <div className="menu-composition-block">
            <h4>Entrée</h4>
            <label>Nom de l'entrée :</label>
            <input type="text" name="entreeNom" value={menu.entreeNom} onChange={handleChange} />
            <label>Ingrédients :</label>
            <textarea name="entreeIngredients" value={menu.entreeIngredients} onChange={handleChange}></textarea>
          </div>

          <div className="menu-composition-block">
            <h4>Plat principal</h4>
            <label>Nom du plat :</label>
            <input type="text" name="platNom" value={menu.platNom} onChange={handleChange} required />
            <label>Ingrédients :</label>
            <textarea name="platIngredients" value={menu.platIngredients} onChange={handleChange}></textarea>
          </div>

          <div className="menu-composition-block">
            <h4>Dessert</h4>
            <label>Nom du dessert :</label>
            <input type="text" name="dessertNom" value={menu.dessertNom} onChange={handleChange} />
            <label>Ingrédients :</label>
            <textarea name="dessertIngredients" value={menu.dessertIngredients} onChange={handleChange}></textarea>
          </div>

          <div className="menu-composition-block">
            <h4>Boisson (optionnel)</h4>
            <label>Nom de la boisson :</label>
            <input type="text" name="boissonNom" value={menu.boissonNom} onChange={handleChange} />
            <label>Ingrédients :</label>
            <textarea name="boissonIngredients" value={menu.boissonIngredients} onChange={handleChange}></textarea>
          </div>
        </div>
      </fieldset>

      {/* Bloc 3 : Résidents affectés */}
      <fieldset>
        <legend>Résidents affectés</legend>

        {/* Champ de recherche */}
        <input
          type="text"
          placeholder="Rechercher un résident"
          value={residentSearch}
          onChange={(e) => setResidentSearch(e.target.value)}
        />

        {/* Liste filtrée */}
        {residentSearch && (
          <div className="resident-suggestions">
            {allResidents
              .filter(r =>
                `${r.nom} ${r.prenom}`.toLowerCase().includes(residentSearch.toLowerCase()) &&
                !selectedResidents.some(sr => sr.id === r.id)
              )
              .slice(0, 5)
              .map(r => (
                <div
                  key={r.id}
                  className="resident-suggestion-item"
                  onClick={() => {
                    setSelectedResidents(prev => [...prev, r]);
                    setResidentSearch('');
                  }}
                >
                  {r.nom} {r.prenom} ({r.aversion})
                </div>
              ))}
          </div>
        )}

        {/* Liste des résidents sélectionnés */}
        <div className="resident-selected-list">
          {selectedResidents.map(r => (
            <div key={r.id} className="resident-selected-item">
              {r.nom} {r.prenom}
              <button
                type="button"
                onClick={() =>
                  setSelectedResidents(prev => prev.filter(sr => sr.id !== r.id))
                }
                className="button-secondary"
              >
                Retirer
              </button>
            </div>
          ))}
        </div>

        <p style={{ marginTop: '10px', fontWeight: '500' }}>
          Nombre total de résidents : {selectedResidents.length}
        </p>
      </fieldset>

      {/* Bloc 4 : Commentaires */}
      <fieldset>
        <legend>Commentaires / Remarques</legend>
        <textarea name="commentaires" value={menu.commentaires} onChange={handleChange}></textarea>
      </fieldset>

      {/* Boutons */}
      <div className="menu-buttons">
        <button type="submit" className="button-primary">Sauvegarder</button>
        <button type="button" onClick={onClose} className="button-secondary">Annuler</button>
      </div>
    </form>
  );
}

export default MenuForm;
