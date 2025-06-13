import { useState } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import '../style/MenuPlanningPage.css';

const services = ['Déjeuner', 'Dîner'];

function MenuPlanningPage() {
  const [planning, setPlanning] = useState({});
  const [selectedMonday, setSelectedMonday] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const joursSemaine = Array.from({ length: 7 }).map((_, index) =>
    format(addDays(selectedMonday, index), 'EEEE', { locale: fr })
  );

  const joursSemaineLabel = Array.from({ length: 7 }).map((_, index) =>
    format(addDays(selectedMonday, index), 'dd/MM')
  );

  const handleAddMenu = (jour, service) => {
    const menuName = prompt(`Nom du menu pour ${jour} - ${service}:`);
    if (!menuName) return;
    const effectif = parseInt(prompt(`Effectif pour le menu "${menuName}":`), 10);
    if (isNaN(effectif)) return;

    setPlanning(prev => {
      const key = `${jour}_${service}`;
      const existingMenus = prev[key] || [];
      return {
        ...prev,
        [key]: [...existingMenus, { menu: menuName, effectif }]
      };
    });
  };

  const handleEffectifChange = (jour, service, index, value) => {
    setPlanning(prev => {
      const key = `${jour}_${service}`;
      const updatedMenus = [...prev[key]];
      updatedMenus[index].effectif = value;
      return {
        ...prev,
        [key]: updatedMenus
      };
    });
  };

  const handleDeleteMenu = (jour, service, index) => {
    setPlanning(prev => {
      const key = `${jour}_${service}`;
      const updatedMenus = [...prev[key]];
      updatedMenus.splice(index, 1);
      return {
        ...prev,
        [key]: updatedMenus
      };
    });
  };

  const handleChangeMonday = (e) => {
    setSelectedMonday(new Date(e.target.value));
  };

  const formatDateRange = () => {
    const start = format(selectedMonday, 'dd/MM');
    const end = format(addDays(selectedMonday, 6), 'dd/MM');
    return `Semaine du ${start} au ${end}`;
  };

  return (
    <div>
      <h1>Planning Semaine - Menus</h1>

      {/* Header Semaine */}
      <div className="menu-planning-header">
        <label>Choisir la semaine (date du lundi) :</label>
        <input
          type="date"
          value={format(selectedMonday, 'yyyy-MM-dd')}
          onChange={handleChangeMonday}
        />
        <p className="menu-planning-week-label">{formatDateRange()}</p>
      </div>

      {/* Planning Table */}
      <div className="menu-planning-container">
        <table className="menu-planning-table">
          <thead>
            <tr>
              <th>Jour / Service</th>
              {services.map(service => (
                <th key={service}>{service}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {joursSemaine.map((jour, index) => (
              <tr key={jour}>
                <td className="menu-planning-day">{jour} ({joursSemaineLabel[index]})</td>
                {services.map(service => {
                  const key = `${jour}_${service}`;
                  const menus = planning[key] || [];
                  return (
                    <td key={service}>
                      <div className="menu-planning-menus-list">
                        {menus.length > 0 ? (
                          menus.map((menuObj, menuIndex) => (
                            <div key={menuIndex} className="menu-planning-menu-item">
                              <div className="menu-planning-menu-name">
                                {menuObj.menu}
                              </div>
                              <div className="menu-planning-effectif">
                                <label>Effectifs :</label>
                                <input
                                  type="number"
                                  min="0"
                                  value={menuObj.effectif}
                                  onChange={(e) =>
                                    handleEffectifChange(jour, service, menuIndex, parseInt(e.target.value, 10))
                                  }
                                />
                              </div>
                              <button
                                className="menu-planning-delete-button"
                                onClick={() => handleDeleteMenu(jour, service, menuIndex)}
                              >
                                Supprimer
                              </button>
                            </div>
                          ))
                        ) : (
                          <em>Aucun menu</em>
                        )}
                      </div>
                      <button
                        onClick={() => handleAddMenu(jour, service)}
                        className="menu-planning-button"
                      >
                        Ajouter un menu
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MenuPlanningPage;
