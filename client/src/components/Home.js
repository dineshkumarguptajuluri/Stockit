import React, { useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import CurrentStock from './checkStock'; // Correct path according to your project structure
import Sales from './Sales';
import Purchases from './Purchase';
import AddProduct from './AddProduct';
import CheckSales from './checkSales';
import CheckPurchases from './checkPurchases';
import { useUser } from './UserContext';
import "../styles/Home.css"

const Home = () => {
  const { logout } = useUser();
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  const handleLogout = () => {
    logout();
    setIsLoggedOut(true);
  };

  if (isLoggedOut) {
    return <Navigate to="/login" replace />;
  }

  return (<div className='dinnu' >
      <header className="top-nav">
  <h1>Stockit Project Application</h1>
  <button onClick={handleLogout}>Logout</button>
</header>
    <div className="home-container">
   
      <aside className="side-nav">
        <Link to="/home/current-stock">Current Stock</Link>
        <Link to="/home/sales">To Sale</Link>
        <Link to="/home/purchases">To Purchase</Link>
        <Link to="/home/add-product">Add Product</Link>
        <Link to="/home/checkSales">Sales Data</Link>
        <Link to="/home/checkPurchases">Purchase Data</Link>
      </aside>
      <main className="content">
        <Routes>
          <Route path="/current-stock" element={<CurrentStock />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/checkSales" element={<CheckSales />} />
          <Route path="/checkPurchases" element={<CheckPurchases />} />
          {/* Default route for Home component */}
          <Route index element={<CurrentStock />} />
        </Routes>
      </main>
    </div>

    </div>
  );
};

export default Home;
