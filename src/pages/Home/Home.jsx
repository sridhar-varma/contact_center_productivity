import React, { useState, useEffect } from 'react';
import './Home.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import tax_1 from '../../assets/taxes.jpeg';
import tax_2 from '../../assets/taxes1.jpeg';
import tax_3 from '../../assets/taxes2.jpeg';
import { useParams } from 'react-router-dom';

const Home = () => {
  const [currentImage, setCurrentImage] = useState(tax_1);
  const { email } = useParams(); // Get email parameter from URL

  useEffect(() => {
    const images = [tax_1, tax_2, tax_3];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length;
      setCurrentImage(images[currentIndex]);
    }, 10000); // Change image every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="homeContainer">
      <Navbar className="navbar" email={email}/>
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
        <p>Welcome, {email}!</p> {/* Display the email obtained from URL */}
      </div>
      <Footer className="footer" />
    </div>
  );
};

export default Home;
