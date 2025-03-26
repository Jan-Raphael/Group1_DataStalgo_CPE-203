import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import axios from 'axios';


// Custom Components
import { GetCookie, RemoveCookie } from '../auth/cookies.jsx';

//Ant Design Icons
import { UserOutlined, SettingOutlined, DollarOutlined, LogoutOutlined } from '@ant-design/icons';

//CSS Components for styling
import HeaderStyle from './header.module.css'; // Header.jsx Main CSS
import Paypal from '../TopUp/Paypal.jsx';

const Header = () => {
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [isDropdownOpen, setisDropdownOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [userDataServer, setuserDataServer] = useState([]);
  const [isPayPalPopupOpen, setIsPayPalPopupOpen] = useState(false);

  const userData = GetCookie('data');
  const username = userData ? userData.username : null;
  const userid = userData ? userData.id : null;
  const usertoken = userData ? userData.token : null;

  const location = useLocation(); 

  const handleLogout = () => {
    RemoveCookie('data');
    const URL = location.pathname;
    switch (true) {
      case URL.startsWith("/settings"):
        return window.location.href = '/';
      default:
        return window.location.reload();
    }

  };
  const toggleDropdown = () => {
    setisDropdownOpen(!isDropdownOpen);
  };
  const togglePayPalPopup = () => {
    setIsPayPalPopupOpen(!isPayPalPopupOpen);
  };
  useEffect(() => {
      const handleScroll = () => {
          const currentScrollY = window.scrollY;
          if (currentScrollY > lastScrollY) {
              setIsScrollingDown(true);
              setisDropdownOpen(false);
          } else {
              setIsScrollingDown(false);
              setisDropdownOpen(false);
          }
          setLastScrollY(currentScrollY);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const fetchUserData = () => {
    axios.get(`http://localhost:8000/api/accounts/user/${username}/`, {
      headers: {
        Authorization: `Bearer ${usertoken}`,
      },
    })
    .then(response => {
      setuserDataServer(response.data);
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
    });
  };

  useEffect(() => {
    if(usertoken){
      fetchUserData();
    }
    const handleUserDataUpdate = () => {
      fetchUserData();
    };

    window.addEventListener('userDataUpdate', handleUserDataUpdate);

    return () => {
      window.removeEventListener('userDataUpdate', handleUserDataUpdate);
    };
  }, []);

  const DropdownItems = [
    { label: 'Profile', link: `/profile/${username}`, icon: <UserOutlined /> },
    { label: 'Settings', link: '/settings', icon: <SettingOutlined /> },
    {
      label: `$${parseFloat(userDataServer?.balance || 0).toFixed(2)}`,
      icon: <DollarOutlined />,
      onClick: togglePayPalPopup // no link here
    }
    ,
    { label: 'Logout', onClick: handleLogout, icon: <LogoutOutlined /> }
  ];

  const HeaderButtons = () => {
    const URL = location.pathname;
    switch (true) {
      case URL === "/":
        return <Link to="/publish" className={HeaderStyle.Btn}>Publish</Link>;
      case URL.startsWith("/profile/"):
        return (
          <>
            <Link to="/" className={HeaderStyle.Btn}>Home</Link>
            <Link to="/publish" className={HeaderStyle.Btn}>Publish</Link>
          </>
        );
      default:
        return <Link to="/" className={HeaderStyle.Btn}>Home</Link>;
    }
  };

  return (
    <>
      <div className={HeaderStyle.Spacer}></div>
      <header className={`${HeaderStyle.Header} ${isScrollingDown ? HeaderStyle.HeaderHidden : ""}`}>
        <Link to="/" className={HeaderStyle.Logo}>EduHub</Link>
        <label htmlFor="nav-toggle" className={HeaderStyle.NavToggleLabel}>
          <span></span>
          <span></span>
          <span></span>
        </label>
        <input type="checkbox" id="nav-toggle" className={HeaderStyle.NavToggle} />
        <nav className={HeaderStyle.Nav}>

         {!userData ? (
            <>
              <Link to="/login" className={HeaderStyle.Btn}>
                Login
              </Link>
            </>
          ) : (
            <>
            <div className={HeaderStyle.AvatarContainer}>
              <div className={HeaderStyle.dropdown}>
              <img
  src={`http://localhost:8000/api/accounts/avatar/${userid}/`}
  alt="User Avatar"
  className={HeaderStyle.avatar}
  onClick={toggleDropdown}
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = '/default-avatar.png'; // Use a placeholder avatar
  }}
/>
                {isDropdownOpen && (
                  <div className={HeaderStyle.menu}>
                    {DropdownItems.map((item, index) => (
                    item.link ? (
                      <Link
                        key={index}
                        to={item.link}
                        className={`${HeaderStyle.menuItem} ${HeaderStyle.menuItemLink}`}
                        onClick={() => setisDropdownOpen(false)}
                      >
                        {item.icon} {item.label}
                      </Link>
                    ) : (
                      <div
                        key={index}
                        className={HeaderStyle.menuItem}
                        onClick={() => {
                          item.onClick?.();
                          setisDropdownOpen(false);
                        }}
                      >
                        {item.icon} {item.label}
                      </div>
                    )
                  ))}

                  </div>
                )}
              </div>
              {HeaderButtons()}
            </div>
            </>
          )}

        </nav>
      </header>
      {isPayPalPopupOpen && <Paypal onClose={togglePayPalPopup} UserId={userid} />}
    </>
  );
};

export default Header;