import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import '../style/AffichageCuisineControl.css';

function AffichageCuisineControl() {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [moment, setMoment] = useState('Déjeuner');
  const [message, setMessage] = useState('');

  const saveConfig = async () => {
    try {
      const response = await fetch('http://localhost:4000/affichage-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, moment })
      });
      const data = await response.json();
      if (data.success) setMessage('Configuration mise à jour');
    } catch (e) {
      console.error(e);
      setMessage('Erreur lors de la mise à jour');
    }
  };

  return (
  <div className="affichage-control-container">
    <h2>Configuration de l’Affichage Cuisine</h2>

    <label>Date :</label>
    <input type="date" value={date} onChange={e => setDate(e.target.value)} />

    <label>Moment :</label>
    <select value={moment} onChange={e => setMoment(e.target.value)}>
      <option value="Petit Déjeuner">Petit Déjeuner</option>
      <option value="Déjeuner">Déjeuner</option>
      <option value="Dîner">Dîner</option>
    </select>

    <button onClick={saveConfig}>Mettre à jour l’affichage</button>
    <p>{message}</p>
  </div>
);

}

export default AffichageCuisineControl;
