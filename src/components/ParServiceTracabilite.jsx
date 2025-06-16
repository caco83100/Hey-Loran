import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

function ParServiceTracabilite() {
  const [searchParams] = useSearchParams();

  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  const [cahierChaine, setCahierChaine] = useState([]);
  const [mixes, setMixes] = useState([]);
  const [refroidissement, setRefroidissement] = useState([]);

  const [newCahier, setNewCahier] = useState({
    heure_debut: '',
    heure_fin: '',
    temperature_plats_chauds: '',
    temperature_plats_froids: '',
    observations: '',
    signature: '',
  });

  const [newMix, setNewMix] = useState({
    produit: '',
    temperature_preparation: '',
    temperature_service: '',
    heure: '',
    observations: '',
    signature: '',
  });

  const [newRefroidissement, setNewRefroidissement] = useState({
    produit: '',
    quantite: '',
    temperature_initiale: '',
    heure_debut: '',
    heure_fin: '',
    temperature_finale: '',
    observations: '',
    signature: '',
  });

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:4000/services');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Erreur chargement services:', error);
    }
  };

  const fetchCahierChaine = async (service_id) => {
    const response = await fetch(`http://localhost:4000/cahier_chaine?service_id=${service_id}`);
    const data = await response.json();
    setCahierChaine(data);
  };

  const fetchMixes = async (service_id) => {
    const response = await fetch(`http://localhost:4000/mixes?service_id=${service_id}`);
    const data = await response.json();
    setMixes(data);
  };

  const fetchRefroidissement = async (service_id) => {
    const response = await fetch(`http://localhost:4000/refroidissement_remise?service_id=${service_id}`);
    const data = await response.json();
    setRefroidissement(data);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    const serviceIdParam = searchParams.get('service_id');
    if (serviceIdParam && services.length > 0) {
      const service = services.find(s => s.id === parseInt(serviceIdParam));
      if (service) {
        handleSelectService(service);
      }
    }
  }, [searchParams, services]);

  const handleSelectService = (service) => {
    setSelectedService(service);
    fetchCahierChaine(service.id);
    fetchMixes(service.id);
    fetchRefroidissement(service.id);
  };

  const handleAddCahier = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:4000/cahier_chaine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service_id: selectedService.id, ...newCahier }),
    });
    const data = await response.json();
    if (data.success) {
      setNewCahier({ heure_debut: '', heure_fin: '', temperature_plats_chauds: '', temperature_plats_froids: '', observations: '', signature: '' });
      fetchCahierChaine(selectedService.id);
    }
  };

  const handleDeleteCahier = async (id) => {
    await fetch(`http://localhost:4000/cahier_chaine/${id}`, { method: 'DELETE' });
    fetchCahierChaine(selectedService.id);
  };

  const handleAddMix = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:4000/mixes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service_id: selectedService.id, ...newMix }),
    });
    const data = await response.json();
    if (data.success) {
      setNewMix({ produit: '', temperature_preparation: '', temperature_service: '', heure: '', observations: '', signature: '' });
      fetchMixes(selectedService.id);
    }
  };

  const handleDeleteMix = async (id) => {
    await fetch(`http://localhost:4000/mixes/${id}`, { method: 'DELETE' });
    fetchMixes(selectedService.id);
  };

  const handleAddRefroidissement = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:4000/refroidissement_remise', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service_id: selectedService.id, ...newRefroidissement }),
    });
    const data = await response.json();
    if (data.success) {
      setNewRefroidissement({ produit: '', quantite: '', temperature_initiale: '', heure_debut: '', heure_fin: '', temperature_finale: '', observations: '', signature: '' });
      fetchRefroidissement(selectedService.id);
    }
  };

  const handleDeleteRefroidissement = async (id) => {
    await fetch(`http://localhost:4000/refroidissement_remise/${id}`, { method: 'DELETE' });
    fetchRefroidissement(selectedService.id);
  };

  return (
    <div>
      <h2>Traçabilité par service</h2>

      <div className="tracabilite-list" style={{ marginTop: '20px' }}>
        {services.map(service => (
          <div
            key={service.id}
            className="tracabilite-item"
            onClick={() => handleSelectService(service)}
            style={{
              cursor: 'pointer',
              backgroundColor: selectedService && selectedService.id === service.id ? '#d0f0e5' : '#fafafa'
            }}
          >
            <strong>{service.date} - {service.moment}</strong>
          </div>
        ))}
      </div>

      {selectedService && (
        <div style={{ marginTop: '30px' }}>
          <h3>Cahier de chaîne</h3>
          <form onSubmit={handleAddCahier} className="tracabilite-form">
            <input type="text" placeholder="Heure début" value={newCahier.heure_debut} onChange={e => setNewCahier({ ...newCahier, heure_debut: e.target.value })} />
            <input type="text" placeholder="Heure fin" value={newCahier.heure_fin} onChange={e => setNewCahier({ ...newCahier, heure_fin: e.target.value })} />
            <input type="text" placeholder="T° plats chauds" value={newCahier.temperature_plats_chauds} onChange={e => setNewCahier({ ...newCahier, temperature_plats_chauds: e.target.value })} />
            <input type="text" placeholder="T° plats froids" value={newCahier.temperature_plats_froids} onChange={e => setNewCahier({ ...newCahier, temperature_plats_froids: e.target.value })} />
            <input type="text" placeholder="Observations" value={newCahier.observations} onChange={e => setNewCahier({ ...newCahier, observations: e.target.value })} />
            <input type="text" placeholder="Signature" value={newCahier.signature} onChange={e => setNewCahier({ ...newCahier, signature: e.target.value })} />
            <button type="submit" className="button-primary">Ajouter</button>
          </form>
          {cahierChaine.map(item => (
            <div key={item.id} className="tracabilite-item">
              <div><strong>{item.heure_debut} - {item.heure_fin}</strong> | T° chauds: {item.temperature_plats_chauds}</div>
              <button onClick={() => handleDeleteCahier(item.id)} className="button-secondary">Supprimer</button>
            </div>
          ))}

          <h3 style={{ marginTop: '20px' }}>Mixés</h3>
          <form onSubmit={handleAddMix} className="tracabilite-form">
            <input type="text" placeholder="Produit" value={newMix.produit} onChange={e => setNewMix({ ...newMix, produit: e.target.value })} />
            <input type="text" placeholder="T° préparation" value={newMix.temperature_preparation} onChange={e => setNewMix({ ...newMix, temperature_preparation: e.target.value })} />
            <input type="text" placeholder="T° service" value={newMix.temperature_service} onChange={e => setNewMix({ ...newMix, temperature_service: e.target.value })} />
            <input type="text" placeholder="Heure" value={newMix.heure} onChange={e => setNewMix({ ...newMix, heure: e.target.value })} />
            <input type="text" placeholder="Observations" value={newMix.observations} onChange={e => setNewMix({ ...newMix, observations: e.target.value })} />
            <input type="text" placeholder="Signature" value={newMix.signature} onChange={e => setNewMix({ ...newMix, signature: e.target.value })} />
            <button type="submit" className="button-primary">Ajouter</button>
          </form>
          {mixes.map(item => (
            <div key={item.id} className="tracabilite-item">
              <div><strong>{item.produit}</strong> | T° service: {item.temperature_service}</div>
              <button onClick={() => handleDeleteMix(item.id)} className="button-secondary">Supprimer</button>
            </div>
          ))}

          <h3 style={{ marginTop: '20px' }}>Refroidissement / Remise en température</h3>
          <form onSubmit={handleAddRefroidissement} className="tracabilite-form">
            <input type="text" placeholder="Produit" value={newRefroidissement.produit} onChange={e => setNewRefroidissement({ ...newRefroidissement, produit: e.target.value })} />
            <input type="text" placeholder="Quantité" value={newRefroidissement.quantite} onChange={e => setNewRefroidissement({ ...newRefroidissement, quantite: e.target.value })} />
            <input type="text" placeholder="T° initiale" value={newRefroidissement.temperature_initiale} onChange={e => setNewRefroidissement({ ...newRefroidissement, temperature_initiale: e.target.value })} />
            <input type="text" placeholder="Heure début" value={newRefroidissement.heure_debut} onChange={e => setNewRefroidissement({ ...newRefroidissement, heure_debut: e.target.value })} />
            <input type="text" placeholder="Heure fin" value={newRefroidissement.heure_fin} onChange={e => setNewRefroidissement({ ...newRefroidissement, heure_fin: e.target.value })} />
            <input type="text" placeholder="T° finale" value={newRefroidissement.temperature_finale} onChange={e => setNewRefroidissement({ ...newRefroidissement, temperature_finale: e.target.value })} />
            <input type="text" placeholder="Observations" value={newRefroidissement.observations} onChange={e => setNewRefroidissement({ ...newRefroidissement, observations: e.target.value })} />
            <input type="text" placeholder="Signature" value={newRefroidissement.signature} onChange={e => setNewRefroidissement({ ...newRefroidissement, signature: e.target.value })} />
            <button type="submit" className="button-primary">Ajouter</button>
          </form>
          {refroidissement.map(item => (
            <div key={item.id} className="tracabilite-item">
              <div><strong>{item.produit}</strong> | T° finale: {item.temperature_finale}</div>
              <button onClick={() => handleDeleteRefroidissement(item.id)} className="button-secondary">Supprimer</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ParServiceTracabilite;
