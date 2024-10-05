import React from 'react';
import NavBar from './components/NavBar';
import ShoppingCart from './components/ShoppingCart';
import Footer from './components/Footer';

function App() {
  return (
    <div className="w-full max-h-screen h-screen flex flex-col gap-3 items-center">

      <NavBar />

      <ShoppingCart />

      <Footer />
    </div>
  );
}

export default App;
