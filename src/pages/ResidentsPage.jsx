import { useState, useEffect } from 'react';
import '../style/ResidentsPage.css';

function ResidentsPage() {
  const [residents, setResidents] = useState([]);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [aversion, setAversion] = useState('');

  const fetchResidents = async () => {
    try {
      const response = await fetch('http://localhost:4000/residents');
      const data = await response.json();
      setResidents(data);
    } catch (error) {
      console.error('Erreur lors du chargement des résidents:', error);
    }
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  const handleAddResident = async (e) => {
    e.preventDefault();

    if (!nom || !prenom) {
      alert('Merci de renseigner au moins le nom et le prénom.');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/residents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, prenom, aversion }),
      });

      const data = await response.json();

      if (data.success) {
        setNom('');
        setPrenom('');
        setAversion('');
        fetchResidents(); // refresh liste
      } else {
        console.error('Erreur lors de l\'ajout du résident');
      }
    } catch (error) {
      console.error('Erreur réseau lors de l\'ajout du résident:', error);
    }
  };

  const handleDeleteResident = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce résident ?')) {
      try {
        const response = await fetch(`http://localhost:4000/residents/${id}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (data.success) {
          fetchResidents(); // refresh liste
        } else {
          alert('Erreur : impossible de supprimer ce résident.');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression du résident:', error);
      }
    }
  };

  return (
    <div>
      <h1>Gestion des Résidents</h1>

      {/* Formulaire d'ajout */}
      <form onSubmit={handleAddResident} className="resident-form">
        <fieldset>
          <legend>Ajouter un résident</legend>
          <label>Nom :</label>
          <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} />

          <label>Prénom :</label>
          <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} />

          <label>Aversion / Allergies / Besoins spéciaux :</label>
          <input type="text" value={aversion} onChange={(e) => setAversion(e.target.value)} />

          <button type="submit" className="button-primary">Ajouter</button>
        </fieldset>
      </form>

      {/* Liste des résidents */}
      <h2>Liste des résidents</h2>
      <div className="resident-list">
        {residents.map(r => (
          <div key={r.id} className="resident-item">
            <div>
              <strong>{r.nom} {r.prenom}</strong><br />
              <em>{r.aversion || 'Aucune aversion spécifiée'}</em>
            </div>
            <button
              type="button"
              onClick={() => handleDeleteResident(r.id)}
              className="button-secondary"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResidentsPage;
