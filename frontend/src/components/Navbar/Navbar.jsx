import React, { useEffect, useState } from 'react'
import './Navbar.css'
import { NavLink, useNavigate } from 'react-router-dom'
import Button from '../common/Button/Button'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'
import { useAccount } from '../../contexts/AccountContext'


function Navbar() {
  const [openMobileNavbar, setOpenMobileNavbar] = useState(false);
  const { userId, setUserId, isActive, setIsActive, isSetup, setIsSetup } = useAuth();
  const { data, setData } = useAccount();
  const navigate = useNavigate();

  //To on/off mobile menu
  const openMobileMenu = () => {
    setOpenMobileNavbar(true);
  }
  const closeMobileMenu = () => {
    setOpenMobileNavbar(false)
  }

  //To handle logout
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      toast.success('Logout Successfully.')
      setIsActive(false)
      navigate('/');
      setUserId('');
      setData({});
      setIsSetup(false);
      localStorage.removeItem('userId')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='navbar-main-container'>
      <div className="navbar-heading">
        <p>Donation MS</p>
      </div>
      <div className={`navbar-logout-container ${openMobileNavbar ? 'mobile-navbar-logout-container' : ''}`}>
        <ul className={`navbar-ul ${openMobileNavbar ? 'mobile-menu' : ''}`}>
          <li className='navbar-li'><NavLink to='/dashboard' onClick={() => { setOpenMobileNavbar(false); }} >Dashboard</NavLink></li>
          <li className='navbar-li'><NavLink to='/adddonation' onClick={() => { setOpenMobileNavbar(false); }} >Add Donation</NavLink></li>
          <li className='navbar-li'><NavLink to='/donationcategories' onClick={() => { setOpenMobileNavbar(false); }}>Categories</NavLink></li>
          <li className='navbar-li'><NavLink to='/myaccount' onClick={() => { setOpenMobileNavbar(false); }}>My Account</NavLink></li>

        </ul>
        <div className="logout-container">
          <Button text='Logout' onClick={handleLogout} icon={<i className="fa-sharp fa-solid fa-arrow-right-from-bracket"></i>} />
        </div>
      </div>
      <div className="icons" onClick={openMobileNavbar ? closeMobileMenu : openMobileMenu}>
        <i className={openMobileNavbar ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'}></i>
      </div>
    </div>
  )
}
"fa-solid fa-bars"
export default Navbar

