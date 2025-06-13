import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MenusPage from './pages/MenusPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/menus" element={<MenusPage />} />
          {/* tu pourras ajouter d’autres routes ici */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
