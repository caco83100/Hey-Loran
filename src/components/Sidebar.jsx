import { NavLink } from 'react-router-dom';
import '../style/Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <span className="material-symbols-outlined logo-icon">restaurant</span>
        <h2>HeyLoran</h2>
      </div>
      <ul>
        <li>
          <span className="material-symbols-outlined">dashboard</span>
          <NavLink to="/">Tableau de bord</NavLink>
        </li>
        <li>
          <span className="material-symbols-outlined">track_changes</span> Traçabilité
        </li>
        <li>
          <span className="material-symbols-outlined">person</span> Données Résidents
        </li>
        <li>
          <span className="material-symbols-outlined">restaurant</span>
          <NavLink to="/menus">Menus (Adaptation)</NavLink>
        </li>
        <li>
          <span className="material-symbols-outlined">send</span> Envoi Cuisine
        </li>
        <li>
          <span className="material-symbols-outlined">tv</span> Affichage Cuisine
        </li>
        <li>
          <span className="material-symbols-outlined">swap_horiz</span> Conversion Formats
        </li>
        <li>
          <span className="material-symbols-outlined">smart_toy</span> Assistant IA
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
