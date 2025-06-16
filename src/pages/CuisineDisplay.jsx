import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import '../style/CuisineDisplay.css';

function CuisineDisplay() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const fetchDisplayConfig = async () => {
      try {
        const res = await fetch('http://192.168.0.30:4000/affichage-config');
        const json = await res.json();
        if (json.success && json.config?.date && json.config?.moment) {
          setConfig(json.config);
        } else {
          console.warn("Aucune configuration d'affichage trouvée");
          setLoading(false);
        }
      } catch (error) {
        console.error('Erreur lors du fetch de configuration d’affichage :', error);
        setLoading(false);
      }
    };

    fetchDisplayConfig();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!config) return;

      try {
        const response = await fetch(`http://192.168.0.30:4000/affichage-cuisine?date=${config.date}&moment=${encodeURIComponent(config.moment)}`);
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('Erreur de récupération :', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [config]);

  if (loading) return <div className="cuisine-container">Chargement...</div>;

  if (!data?.serviceFound) {
    return (
      <div className="cuisine-container">
        Aucun service trouvé pour {config?.date || '—'} / {config?.moment || '—'}
      </div>
    );
  }

  return (
    <div className="cuisine-container">
      <h1>Affichage Cuisine</h1>
      <h2>{format(new Date(config.date), 'dd/MM/yyyy')} - {config.moment}</h2>

      <div className="cuisine-menus">
        {data.menus.map((menu, index) => (
          <div key={index} className="cuisine-menu-card">
            <h3>Menu : {menu.type}</h3>
            {menu.entreeNom && <p><strong>Entrée :</strong> {menu.entreeNom}</p>}
            {menu.platNom && <p><strong>Plat :</strong> {menu.platNom}</p>}
            {menu.dessertNom && <p><strong>Dessert :</strong> {menu.dessertNom}</p>}
            {menu.boissonNom && <p><strong>Boisson :</strong> {menu.boissonNom}</p>}
            <p><em>Commentaire : {menu.commentaires || '—'}</em></p>
          </div>
        ))}
      </div>

      <div className="cuisine-residents">
        <h3>Résidents concernés :</h3>
        <ul>
          {data.residents.map(r => (
            <li key={r.id}>{r.nom} {r.prenom} ({r.aversion || '—'})</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CuisineDisplay;
