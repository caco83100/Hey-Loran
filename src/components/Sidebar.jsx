import { NavLink } from 'react-router-dom';

import logoImage from '../assets/logo.png';
import '../style/Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={logoImage} alt="Logo HeyLoran" className="sidebar-logo" />
      </div>

      <div className="sidebar-links">
        <NavLink to="/" className="sidebar-link">
          <span className="material-symbols-outlined">dashboard</span>
          Tableau de bord
        </NavLink>

        <NavLink to="/tracabilite" className="sidebar-link">
          <span className="material-symbols-outlined">track_changes</span>
          Traçabilité
        </NavLink>

        <NavLink to="/residents" className="sidebar-link">
          <span className="material-symbols-outlined">person</span>
          Données Résidents
        </NavLink>

        <NavLink to="/menus" className="sidebar-link">
          <span className="material-symbols-outlined">restaurant</span>
          Menus (Adaptation)
        </NavLink>

        <NavLink to="/envoi" className="sidebar-link">
          <span className="material-symbols-outlined">send</span>
          Envoi Cuisine
        </NavLink>

        <NavLink to="/affichage" className="sidebar-link">
          <span className="material-symbols-outlined">tv</span>
          Affichage Cuisine
        </NavLink>

        <NavLink to="/conversion" className="sidebar-link">
          <span className="material-symbols-outlined">swap_horiz</span>
          Conversion Formats
        </NavLink>

        <NavLink to="/assistant" className="sidebar-link">
          <span className="material-symbols-outlined">smart_toy</span>
          Assistant IA
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;