import { NavLink } from 'react-router-dom';
import '../style/MenusPage.css';

function MenusPage() {
  return (
    <div>
      <h1>Menus (Adaptation)</h1>
      <p>Que souhaitez-vous faire ?</p>
      <div className="menus-actions">
        <NavLink to="/menus/planning" className="menu-action-card">
          <span className="material-symbols-outlined menu-action-icon">calendar_view_week</span>
          <div>
            <h3>Planning Semaine</h3>
            <p>Planifier les menus et effectifs pour toute la semaine.</p>
          </div>
        </NavLink>
        
        <NavLink to="/menus/add" className="menu-action-card">
          <span className="material-symbols-outlined menu-action-icon">add_circle</span>
          <div>
            <h3>Ajouter un menu</h3>
            <p>Créer un nouveau menu adapté pour un service.</p>
          </div>
        </NavLink>

        <NavLink to="/menus/history" className="menu-action-card">
          <span className="material-symbols-outlined menu-action-icon">history</span>
          <div>
            <h3>Consulter l’historique</h3>
            <p>Voir les menus précédemment saisis, regroupés par jour et service.</p>
          </div>
        </NavLink>
  
      </div>
    </div>
  );
}

export default MenusPage;
