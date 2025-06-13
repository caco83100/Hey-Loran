import { useState, useEffect } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import '../style/MenuPlanningPage.css';
import MenuForm from '../components/MenuForm';

const services = ['Déjeuner', 'Dîner'];

function MenuPlanningPage() {
  const [selectedMonday, setSelectedMonday] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [menus, setMenus] = useState([]);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [menuToEdit, setMenuToEdit] = useState(null);
  const [defaultDate, setDefaultDate] = useState('');
  const [defaultMoment, setDefaultMoment] = useState('');


  const joursSemaine = Array.from({ length: 7 }).map((_, index) =>
    format(addDays(selectedMonday, index), 'EEEE', { locale: fr })
  );

  const joursSemaineLabel = Array.from({ length: 7 }).map((_, index) =>
    format(addDays(selectedMonday, index), 'dd/MM')
  );

  const fetchMenus = async (fromDate, toDate) => {
    try {
      const response = await fetch(`http://localhost:4000/menus?from=${fromDate}&to=${toDate}`);
      const data = await response.json();
      setMenus(data);
    } catch (error) {
      console.error('Erreur lors du chargement des menus:', error);
    }
  };

  useEffect(() => {
    const fromDate = format(selectedMonday, 'yyyy-MM-dd');
    const toDate = format(addDays(selectedMonday, 6), 'yyyy-MM-dd');
    fetchMenus(fromDate, toDate);
  }, [selectedMonday]);

  const handleChangeMonday = (e) => {
    setSelectedMonday(new Date(e.target.value));
  };

  const formatDateRange = () => {
    const start = format(selectedMonday, 'dd/MM');
    const end = format(addDays(selectedMonday, 6), 'dd/MM');
    return `Semaine du ${start} au ${end}`;
  };

  const handleAddMenu = (jourIndex, service) => {
    const date = format(addDays(selectedMonday, jourIndex), 'yyyy-MM-dd');
    setDefaultDate(date);
    setDefaultMoment(service);
    setMenuToEdit(null); // mode ajout
    setShowMenuForm(true);
  };

  const handleEditMenu = (menu) => {
    setMenuToEdit(menu); // mode édition
    setShowMenuForm(true);
  };

  const handleDeleteMenu = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce menu ?')) {
        try {
        const response = await fetch(`http://localhost:4000/menus/${id}`, {
            method: 'DELETE',
        });

        const data = await response.json();

        if (data.success) {
            // refresh menus
            fetchMenus(
            format(selectedMonday, 'yyyy-MM-dd'),
            format(addDays(selectedMonday, 6), 'yyyy-MM-dd')
            );
        } else {
            alert('Erreur : impossible de supprimer ce menu.');
        }
        } catch (error) {
        console.error('Erreur lors de la suppression du menu:', error);
        }
    }
    };



  return (
    <div>
      <h1>Planning Semaine - Menus</h1>

      {/* Header Semaine */}
      <div className="menu-planning-header">
        <label>Choisir la semaine :</label>
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
                  const menusForCell = menus.filter(menu =>
                    menu.date === format(addDays(selectedMonday, index), 'yyyy-MM-dd') &&
                    menu.moment === service
                  );

                  return (
                    <td key={service}>
                      <div className="menu-planning-menus-list">
                        {menusForCell.length > 0 ? (
                          menusForCell.map(menu => (
                            <div
                                key={menu.id}
                                className="menu-planning-menu-item"
                                onClick={() => handleEditMenu(menu)} 
                                style={{ cursor: 'pointer' }}
                                >
                                <div style={{ flexGrow: 1 }}>
                                    <strong>{menu.type}</strong>
                                </div>
                                <button
                                    onClick={(e) => {
                                    e.stopPropagation(); // pour éviter que le clic sur Supprimer ouvre le form
                                    handleDeleteMenu(menu.id);
                                    }}
                                    className="menu-delete-button"
                                >
                                    Supprimer
                                </button>
                                </div>

                            ))

                        ) : (
                          <em>Aucun menu</em>
                        )}
                      </div>
                      <button onClick={() => handleAddMenu(index, service)} className="menu-planning-button">
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
      {showMenuForm && (
        <div className="modal-overlay">
            <div className="modal-content">
            <MenuForm
                mode={menuToEdit ? 'edit' : 'add'}
                initialMenuData={menuToEdit}
                defaultDate={defaultDate}
                defaultMoment={defaultMoment}
                onClose={() => {
                setShowMenuForm(false);
                setMenuToEdit(null);
                fetchMenus(
                    format(selectedMonday, 'yyyy-MM-dd'),
                    format(addDays(selectedMonday, 6), 'yyyy-MM-dd')
                ); // refresh menus après ajout/edition
                }}
            />
            </div>
        </div>
      )}
    </div>
  );
}

export default MenuPlanningPage;
