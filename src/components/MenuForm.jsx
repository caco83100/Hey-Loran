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

  const [residentsList, setResidentsList] = useState([{ name: '' }]);

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
      // TODO : plus tard → load residents depuis BDD
      setResidentsList([{ name: '' }]); // pour l'instant on remet à vide
    } else if (mode === 'add') {
      setMenu((prev) => ({
        ...prev,
        date: defaultDate || '',
        moment: defaultMoment || 'Déjeuner',
      }));
      setResidentsList([{ name: '' }]);
    }
  }, [mode, initialMenuData, defaultDate, defaultMoment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenu((prevMenu) => ({
      ...prevMenu,
      [name]: value,
    }));
  };

  const handleResidentChange = (index, value) => {
    const updatedResidents = [...residentsList];
    updatedResidents[index].name = value;
    setResidentsList(updatedResidents);
  };

  const handleAddResident = () => {
    setResidentsList(prev => [...prev, { name: '' }]);
  };

  const handleDeleteResident = (index) => {
    const updatedResidents = [...residentsList];
    updatedResidents.splice(index, 1);
    setResidentsList(updatedResidents);
  };

  const saveMenu = async (menuData) => {
    try {
      const response = await fetch('http://localhost:4000/menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menuData),
      });

      const data = await response.json();

      if (data.success) {
        console.log(`Menu sauvegardé avec l'ID ${data.id}`);
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
      residents: residentsList,
      effectif: residentsList.length,
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
        {residentsList.map((resident, index) => (
          <div key={index} className="resident-row">
            <input
              type="text"
              placeholder="Nom du résident"
              value={resident.name}
              onChange={(e) => handleResidentChange(index, e.target.value)}
            />
            <button type="button" onClick={() => handleDeleteResident(index)} className="button-secondary">Supprimer</button>
          </div>
        ))}
        <button type="button" onClick={handleAddResident} className="button-primary">
          Ajouter un résident
        </button>
        <p style={{ marginTop: '10px', fontWeight: '500' }}>
          Nombre total de résidents : {residentsList.length}
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
