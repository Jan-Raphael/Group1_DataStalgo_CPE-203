import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Dropdown.module.css';

const Dropdown = ({ avatarSrc, menuItems, showDropdown }) => {
  const [isOpen, setIsOpen] = useState(false);
  setIsOpen(showDropdown);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.dropdown}>
      <img
        src={avatarSrc}
        alt="User Avatar"
        className={styles.avatar}
        onClick={toggleDropdown}
      />
      {isOpen && (
        <div className={styles.menu}>
          {menuItems.map((item, index) => (
            <div key={index} className={styles.menuItem} onClick={item.onClick}>
              {item.link ? <Link to={item.link}>{item.label}</Link> : item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;