import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import MenusPage from './pages/MenusPage';
import MenuFormPage from './pages/MenuFormPage';
import MenuHistoryPage from './pages/MenuHistoryPage';
import MenuPlanningPage from './pages/MenuPlanningPage';

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/menus" element={<MenuPlanningPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
