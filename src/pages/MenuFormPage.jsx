import MenuForm from '../components/MenuForm';
import { useState } from 'react';

function MenuFormPage() {
  const [menus, setMenus] = useState([]);

  const handleAddMenu = (newMenu) => {
    setMenus([...menus, newMenu]);
    alert('Menu ajouté !'); // temporaire
  };

  return (
    <div>
      <h1>Ajouter un menu</h1>
      <MenuForm onAddMenu={handleAddMenu} />
    </div>
  );
}

export default MenuFormPage;
