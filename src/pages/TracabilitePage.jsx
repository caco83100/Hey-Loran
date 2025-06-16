import { useState } from 'react';
import { useEffect } from 'react';
import ParServiceTracabilite from '../components/ParServiceTracabilite.jsx';
import '../style/TracabilitePage.css';

function TracabilitePage() {
  const [activeTab, setActiveTab] = useState('par_menu');

  // Pour Réception produits
  const [receptionList, setReceptionList] = useState([]);
  const [newReception, setNewReception] = useState({
    date_reception: '',
    produit: '',
    temperature_reception: '',
    etat_emballage: '',
    dlc: '',
    conformite: '',
    observations: '',
    signature: '',
  });

  // Pour Températures équipements
  const [equipementsList, setEquipementsList] = useState([]);
  const [newEquipement, setNewEquipement] = useState({
    date: '',
    equipement: '',
    temperature: '',
    observations: '',
    signature: '',
  });

  // Charger données Réception produits
  const fetchReception = async () => {
    try {
      const response = await fetch('http://localhost:4000/controle_reception');
      const data = await response.json();
      setReceptionList(data);
    } catch (error) {
      console.error('Erreur chargement reception:', error);
    }
  };

  // Charger données Températures équipements
  const fetchEquipements = async () => {
    try {
      const response = await fetch('http://localhost:4000/temperature_equipements');
      const data = await response.json();
      setEquipementsList(data);
    } catch (error) {
      console.error('Erreur chargement equipements:', error);
    }
  };

  // Au chargement de la page → charger les 2 listes
  useEffect(() => {
    if (activeTab === 'reception') fetchReception();
    if (activeTab === 'equipements') fetchEquipements();
  }, [activeTab]);

  // Ajouter Réception
  const handleAddReception = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/controle_reception', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReception),
      });
      const data = await response.json();
      if (data.success) {
        setNewReception({
          date_reception: '',
          produit: '',
          temperature_reception: '',
          etat_emballage: '',
          dlc: '',
          conformite: '',
          observations: '',
          signature: '',
        });
        fetchReception();
      }
    } catch (error) {
      console.error('Erreur ajout reception:', error);
    }
  };

  // Supprimer Réception
  const handleDeleteReception = async (id) => {
    if (window.confirm('Supprimer cette ligne ?')) {
      try {
        await fetch(`http://localhost:4000/controle_reception/${id}`, { method: 'DELETE' });
        fetchReception();
      } catch (error) {
        console.error('Erreur suppression reception:', error);
      }
    }
  };

  // Ajouter Equipement
  const handleAddEquipement = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/temperature_equipements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEquipement),
      });
      const data = await response.json();
      if (data.success) {
        setNewEquipement({
          date: '',
          equipement: '',
          temperature: '',
          observations: '',
          signature: '',
        });
        fetchEquipements();
      }
    } catch (error) {
      console.error('Erreur ajout equipement:', error);
    }
  };

  // Supprimer Equipement
  const handleDeleteEquipement = async (id) => {
    if (window.confirm('Supprimer cette ligne ?')) {
      try {
        await fetch(`http://localhost:4000/temperature_equipements/${id}`, { method: 'DELETE' });
        fetchEquipements();
      } catch (error) {
        console.error('Erreur suppression equipement:', error);
      }
    }
  };

  return (
    <div>
      <h1>Traçabilité</h1>

      {/* Onglets */}
      <div className="tracabilite-tabs">
        <button
          className={activeTab === 'par_service' ? 'active' : ''}
          onClick={() => setActiveTab('par_service')}
        >
          Par service
        </button>

        <button
          className={activeTab === 'reception' ? 'active' : ''}
          onClick={() => setActiveTab('reception')}
        >
          Réception produits
        </button>
        <button
          className={activeTab === 'equipements' ? 'active' : ''}
          onClick={() => setActiveTab('equipements')}
        >
          Températures équipements
        </button>
      </div>

      {/* Contenu par onglet */}
      {activeTab === 'par_service' && 
        <ParServiceTracabilite />
      }


      {activeTab === 'reception' && (
        <div>
          <h2>Réception produits</h2>

          <form onSubmit={handleAddReception} className="tracabilite-form">
            <input type="date" value={newReception.date_reception} onChange={e => setNewReception({ ...newReception, date_reception: e.target.value })} required />
            <input type="text" placeholder="Produit" value={newReception.produit} onChange={e => setNewReception({ ...newReception, produit: e.target.value })} required />
            <input type="text" placeholder="Température réception" value={newReception.temperature_reception} onChange={e => setNewReception({ ...newReception, temperature_reception: e.target.value })} />
            <input type="text" placeholder="Etat emballage" value={newReception.etat_emballage} onChange={e => setNewReception({ ...newReception, etat_emballage: e.target.value })} />
            <input type="text" placeholder="DLC" value={newReception.dlc} onChange={e => setNewReception({ ...newReception, dlc: e.target.value })} />
            <input type="text" placeholder="Conformité" value={newReception.conformite} onChange={e => setNewReception({ ...newReception, conformite: e.target.value })} />
            <input type="text" placeholder="Observations" value={newReception.observations} onChange={e => setNewReception({ ...newReception, observations: e.target.value })} />
            <input type="text" placeholder="Signature" value={newReception.signature} onChange={e => setNewReception({ ...newReception, signature: e.target.value })} />
            <button type="submit" className="button-primary">Ajouter</button>
          </form>

          <div className="tracabilite-list">
            {receptionList.map(item => (
              <div key={item.id} className="tracabilite-item">
                <div>
                  <strong>{item.date_reception} - {item.produit}</strong><br />
                  T°: {item.temperature_reception} | DLC: {item.dlc} | {item.conformite}
                </div>
                <button onClick={() => handleDeleteReception(item.id)} className="button-secondary">Supprimer</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'equipements' && (
        <div>
          <h2>Températures équipements</h2>

          <form onSubmit={handleAddEquipement} className="tracabilite-form">
            <input type="date" value={newEquipement.date} onChange={e => setNewEquipement({ ...newEquipement, date: e.target.value })} required />
            <input type="text" placeholder="Equipement" value={newEquipement.equipement} onChange={e => setNewEquipement({ ...newEquipement, equipement: e.target.value })} required />
            <input type="text" placeholder="Température" value={newEquipement.temperature} onChange={e => setNewEquipement({ ...newEquipement, temperature: e.target.value })} />
            <input type="text" placeholder="Observations" value={newEquipement.observations} onChange={e => setNewEquipement({ ...newEquipement, observations: e.target.value })} />
            <input type="text" placeholder="Signature" value={newEquipement.signature} onChange={e => setNewEquipement({ ...newEquipement, signature: e.target.value })} />
            <button type="submit" className="button-primary">Ajouter</button>
          </form>

          <div className="tracabilite-list">
            {equipementsList.map(item => (
              <div key={item.id} className="tracabilite-item">
                <div>
                  <strong>{item.date} - {item.equipement}</strong> | T°: {item.temperature}
                </div>
                <button onClick={() => handleDeleteEquipement(item.id)} className="button-secondary">Supprimer</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TracabilitePage;
