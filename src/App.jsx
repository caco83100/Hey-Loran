import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import MenuPlanningPage from './pages/MenuPlanningPage';
import ResidentsPage from './pages/ResidentsPage';
import TracabilitePage from './pages/TracabilitePage';
import AffichageCuisineControl from './pages/AffichageCuisineControl';
import CuisineDisplay from './pages/CuisineDisplay';
const ip = import.meta.env.VITE_SERVER_IP;



function App(
) {
   console.log(`Application démarrée avec l'IP du serveur : ${ip}`);
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/menus" element={<MenuPlanningPage />} />
          <Route path="/residents" element={<ResidentsPage />} />
          <Route path="/tracabilite" element={<TracabilitePage />} />
          <Route path="/affichage-cuisine" element={<AffichageCuisineControl />} />
          <Route path="/cuisine-display" element={<CuisineDisplay />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
