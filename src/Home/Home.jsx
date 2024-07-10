import React, { useState, useEffect } from 'react';
import './Home.css'; // Import Home.css for styling
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import tax_1 from '../../assets/taxes.jpeg';
import tax_2 from '../../assets/taxes1.jpeg';
import tax_3 from '../../assets/taxes2.jpeg';
import { useParams } from 'react-router-dom';

const Home = () => {
  const { email } = useParams(); // Get email parameter from URL
  const [currentImage, setCurrentImage] = useState(tax_1);
  const [showContact, setShowContact] = useState(false); // State to toggle view

  useEffect(() => {
    const images = [tax_1, tax_2, tax_3];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length;
      setCurrentImage(images[currentIndex]);
    }, 10000); // Change image every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchPreviousInfo = async () => {
    try {
      const userDetails = {
        email: email // Use the email from URL
      };

      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDetails),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      console.log('Fetched data:', data);
      setData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleToggleView = () => {
    setShowContact(!showContact);
  };

  return (
    <div className="homeContainer">
      <Navbar className="navbar" email={email} />
      <p>Welcome, {email}!</p> {/* Display the email obtained from URL */}
      <button onClick={handleToggleView}>
        {showContact ? 'Show Image and Description' : 'Show Contact Us'}
      </button>
      {showContact ? (
        <div className="contact-us">
          <h2>Contact Us</h2>
          <p>If you have any questions, feel free to reach out!</p>
          <p>Phone: (123) 456-7890</p>
          <p>Email: support@example.com</p>
        </div>
      ) : (
        <div className="side">
          <img src={currentImage} className="centeredImage" alt="Taxes" />
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquam
            risus lectus, eu venenatis sem consequat et. Nulla facilisi. Integer
            non gravida purus. Phasellus nec ullamcorper velit. Sed non purus ac
            leo congue hendrerit. Vestibulum ante ipsum primis in faucibus orci
            luctus et ultrices posuere cubilia curae; Vestibulum malesuada
            pulvinar est, sit amet iaculis metus fermentum sit amet. Donec
            elementum eros a dui euismod interdum. Nulla varius, nisl a
            scelerisque finibus, tortor nisl euismod nunc, et tempus justo elit
            vel libero. Cras elementum volutpat tortor, ac varius ante.
          </p>
        </div>
      )}
      <Footer className="footer" />
    </div>
  );
};

export default Home;
