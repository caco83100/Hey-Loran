import { useState } from 'react';
import '../style/Menus.css';

function MenuForm({ onAddMenu }) {
  const [menu, setMenu] = useState({
    date: '',
    moment: 'Déjeuner',
    type: '',
    entree: '',
    plat: '',
    dessert: '',
    boisson: '',
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
    if (!menu.date || !menu.type || !menu.plat) {
      alert('Merci de remplir au moins la date, le type de menu et le plat principal.');
      return;
    }
    onAddMenu(menu);
    setMenu({
      date: '',
      moment: 'Déjeuner',
      type: '',
      entree: '',
      plat: '',
      dessert: '',
      boisson: '',
      commentaires: '',
    });
  };

  return (
    <div className="card">
      <h2>Ajouter un menu</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Date du service :</label><br />
          <input type="date" name="date" value={menu.date} onChange={handleChange} required />
        </div>

        <div>
          <label>Moment du service :</label><br />
          <select name="moment" value={menu.moment} onChange={handleChange}>
            <option>Petit Déjeuner</option>
            <option>Déjeuner</option>
            <option>Goûter</option>
            <option>Dîner</option>
          </select>
        </div>

        <div>
          <label>Type de menu :</label><br />
          <input type="text" name="type" value={menu.type} onChange={handleChange} required />
        </div>

        <div>
          <label>Entrée :</label><br />
          <input type="text" name="entree" value={menu.entree} onChange={handleChange} />
        </div>

        <div>
          <label>Plat principal :</label><br />
          <input type="text" name="plat" value={menu.plat} onChange={handleChange} required />
        </div>

        <div>
          <label>Dessert :</label><br />
          <input type="text" name="dessert" value={menu.dessert} onChange={handleChange} />
        </div>

        <div>
          <label>Boisson :</label><br />
          <input type="text" name="boisson" value={menu.boisson} onChange={handleChange} />
        </div>

        <div>
          <label>Commentaires / Remarques :</label><br />
          <textarea name="commentaires" value={menu.commentaires} onChange={handleChange}></textarea>
        </div>

        <button type="submit" className="button" style={{ marginTop: '10px' }}>Ajouter le menu</button>
      </form>
    </div>
  );
}

export default MenuForm;
