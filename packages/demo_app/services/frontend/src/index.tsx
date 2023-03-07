import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Checkout from '../pages/checkout';
import ImgBidding from '../pages/imgbidding';
import UserPage from '../pages/userhomepage';
import Login from '../pages/login';
import Gallery from '../pages/gallery';
import './components/ImgDisplay/ImgStyleDisplay.css'
import './styles/index.css'
import './components/BiddingForm/biddingform.css'
const App = () => {
  return (
    <div className='app'>
     Hello World
    </div>
  );
};

createRoot(document.querySelector('#AppRoot')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<h1>Home route</h1>} />
        <Route path='/login' element={<Login />} />
        <Route path='/userpage' element={<UserPage />} />
        <Route path='/gallery' element={<Gallery />} />
        <Route path='/imgbidding' element={<ImgBidding />} />
        <Route path='/checkout' element={<Checkout />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
