import '../style/MenuList.css';

function MenuList({ menus }) {
  return (
    <div className="menu-list">
      <h2>Menus existants</h2>
      {menus.length === 0 && <p>Aucun menu saisi pour le moment.</p>}
      {menus.map((menu, index) => (
        <div key={index} className="menu-card">
          <div className="menu-card-title">
            {menu.date} - {menu.moment} - {menu.type}
          </div>
          <p><strong>Entrée :</strong> {menu.entree}</p>
          <p><strong>Plat :</strong> {menu.plat}</p>
          <p><strong>Dessert :</strong> {menu.dessert}</p>
          <p><strong>Boisson :</strong> {menu.boisson}</p>
          {menu.commentaires && <p><em>Commentaires : {menu.commentaires}</em></p>}
        </div>
      ))}
    </div>
  );
}

export default MenuList;
