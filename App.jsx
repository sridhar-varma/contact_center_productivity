import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Player from './pages/Player/Player';
import { onAuthStateChanged } from 'firebase/auth'; // Import onAuthStateChanged from Firebase auth
import { auth } from './firebase';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [userEmail, setUserEmail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("Logged in");
        const userInfo = {
          email: user.email // Access user's email from currentUser
          // You can add more user information here as needed
        };
        setUserEmail(userInfo.email);
        navigate(`/home/${userInfo.email}`); // Redirect to /home/:email
      } else {
        console.log("Logged Out");
        setUserEmail(null);
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div>
      <ToastContainer theme='dark'/>
      <Routes>
        <Route path='/home/:email' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/player/:id' element={<Player />} />
      </Routes>
    </div>
  );
}

export default App;
