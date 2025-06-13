import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../style/MenuForm.css';

function MenuForm({ onAddMenu }) {
  const [menu, setMenu] = useState({
    date: '',
    moment: 'Déjeuner',
    type: '',
    entreeNom: '',
    entreeIngredients: '',
    platNom: '',
    platIngredients: '',
    dessertNom: '',
    dessertIngredients: '',
    boissonNom: '',
    boissonIngredients: '',
    effectif: '',
    residents: '',
    commentaires: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenu((prevMenu) => ({
      ...prevMenu,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!menu.date || !menu.type || !menu.platNom) {
      alert('Merci de remplir au minimum la date, le type de menu et le plat principal.');
      return;
    }
    onAddMenu(menu);
    alert('Menu ajouté !');

    // reset form
    setMenu({
      date: '',
      moment: 'Déjeuner',
      type: '',
      entreeNom: '',
      entreeIngredients: '',
      platNom: '',
      platIngredients: '',
      dessertNom: '',
      dessertIngredients: '',
      boissonNom: '',
      boissonIngredients: '',
      effectif: '',
      residents: '',
      commentaires: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="menu-form">
      {/* Bloc 1 : Détails du service */}
      <fieldset>
        <legend>Détails du service</legend>
        <label>Date du service :</label>
        <input type="date" name="date" value={menu.date} onChange={handleChange} required />

        <label>Moment du service :</label>
        <select name="moment" value={menu.moment} onChange={handleChange}>
          <option>Petit Déjeuner</option>
          <option>Déjeuner</option>
          <option>Goûter</option>
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

      {/* Bloc 3 : Effectif */}
      <fieldset>
        <legend>Effectif prévu</legend>
        <input type="number" name="effectif" value={menu.effectif} onChange={handleChange} min="0" />
      </fieldset>

      {/* Bloc 4 : Résidents affectés */}
      <fieldset>
        <legend>Résidents affectés</legend>
        <textarea
          name="residents"
          value={menu.residents}
          onChange={handleChange}
          placeholder="Exemple : Dupont Jean, Martin Sophie, etc."
        ></textarea>
      </fieldset>

      {/* Bloc 5 : Commentaires */}
      <fieldset>
        <legend>Commentaires / Remarques</legend>
        <textarea name="commentaires" value={menu.commentaires} onChange={handleChange}></textarea>
      </fieldset>

      {/* Boutons */}
      <div className="menu-buttons">
        <button type="submit" className="button-primary">Ajouter le menu</button>
        <NavLink to="/menus" className="button-secondary">Annuler</NavLink>
      </div>
    </form>
  );
}

export default MenuForm;
