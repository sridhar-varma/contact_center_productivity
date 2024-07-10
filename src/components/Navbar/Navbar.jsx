import React, { useEffect, useRef, useNavigate } from 'react';
import './Navbar.css';
import caret_icon from '../../assets/caret_icon.svg';
import profile_icon from '../../assets/profile_img.png';
import { logout } from '../../firebase';

const Navbar = (email) => {
  const navRef = useRef();
  


  // Function to handle fetching of previous info data
  const fetchPreviousInfo = async () => {
    const userEmail = email.email; // Replace with actual user email or get from authentication context
    console.log(userEmail);
    try {
      const userDetails = {
        email: userEmail
      };
  
      const response = await fetch('https://jcgvlrb76h2tnccvzqipnkavq40lwupg.lambda-url.eu-west-2.on.aws', {
        method: 'POST',
        body: JSON.stringify(userDetails),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
  
      const data = await response.json();
      console.log('Fetched data:', data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY >= 80) {
        navRef.current.classList.add('nav-dark');
      } else {
        navRef.current.classList.remove('nav-dark');
      }
    });
  }, []);

  return (
    <div ref={navRef} className='navbar'>
      <div className="navbar-left">
        <h1>SmartConnect</h1>
        <ul>
          <li>Documentation</li>
          <li onClick={fetchPreviousInfo}>Previous Info</li> {/* Add onClick handler */}
          <li>My Account</li>
        </ul>
      </div>
      <div className="navbar-right">
        <div className="navbar-profile">
          <img src={profile_icon} className='profile' alt='Profile'/> 
          <img src={caret_icon} alt='Caret'/>
          <div className='dropdown'>
            <p onClick={() => {
              logout();
            }}>Sign out</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
