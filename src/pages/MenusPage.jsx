import { useState } from 'react';
import MenuForm from '../components/MenuForm';
import MenuList from '../components/MenuList';
import '../style/Menus.css';

function MenusPage() {
  const [menus, setMenus] = useState([]);

  const handleAddMenu = (newMenu) => {
    setMenus([...menus, newMenu]);
  };

  return (
    <div>
      <h1>Menus (Adaptation)</h1>
      <MenuForm onAddMenu={handleAddMenu} />
      <MenuList menus={menus} />
    </div>
  );
}

export default MenusPage;
