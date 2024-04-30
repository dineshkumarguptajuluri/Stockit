import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Sales = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [buyerName, setBuyerName] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10)); // Default to today's date
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:4000/getProducts');
        const productData = response.data.products;
     //   console.log(response.data.products);
        setProducts(productData);
      } catch (error) {
        console.error('Error fetching products:', error);
        setErrorMessage('Failed to fetch products');
      }
    };
    fetchProducts();
  }, []);

  const handleProductChange = (event) => {
    const productId = event.target.dataset.productid;
    const quantityInput = event.target.value;
    const quantity = quantityInput === '' ? '' : parseInt(quantityInput, 10);
  
    if (quantityInput === '') {
      updateSelectedProducts(productId, '');
      setErrorMessage(null);
    } else if (!isNaN(quantity)) {
      if (quantity === 0) {
        updateSelectedProducts(productId, 0);
      } else {
        const product = products.find(p => p._id === productId);
        if (product && quantity > product.stock) {
          setErrorMessage(`Insufficient stock for ${product.name}. Only ${product.stock} available.`);
          updateSelectedProducts(productId, 0);
        } else {
          updateSelectedProducts(productId, quantity);
          setErrorMessage(null);
        }
      }
    } else {
      setErrorMessage('Please enter a valid quantity');
    }
  };

  const updateSelectedProducts = (productId, quantity) => {
    const updatedSelectedProducts = selectedProducts.filter(item => item.productId !== productId);
    if (quantity !== '') { // Only add back if quantity isn't an empty string
      updatedSelectedProducts.push({ productId, quantity });
    }
    setSelectedProducts(updatedSelectedProducts);
  };
  const renderProducts = () => {
    let grandTotal = 0; // Initialize grand total

    if (!products.length) {
      return <p>Loading products...</p>;
    }
    return (
      <>
        {products.map((product) => {
          const selectedProduct = selectedProducts.find(
            item => item.productId === product._id
          );
          const quantity = selectedProduct ? selectedProduct.quantity : '';
          const individualPrice = selectedProduct ? product.price * quantity : 0;
          grandTotal += individualPrice;

          return (
            <div key={product._id} className="product-item">
              <p>{product.name}</p>
              <p>Unit Price: ${product.price.toFixed(2)}</p>
              <p>Total: ${individualPrice.toFixed(2)}</p>
              <input
                type="number"
                min="1"
                max={product.stock}
                onChange={handleProductChange}
                data-productid={product._id}
                placeholder="Enter Quantity"
                value={quantity}
              />
            </div>
          );
        })}
        <div className="grand-total">
          <h3>Grand Total: ${grandTotal.toFixed(2)}</h3>
        </div>
      </>
    );
  };

  const handleSaleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submit behavior
    if (!selectedProducts.length) {
      setErrorMessage('Please select products to purchase');
      return;
    }
  
    // Map through selected products to add price and calculate total for each
    const productsWithPrices = selectedProducts.map((item) => {
      const product = products.find(p => p._id === item.productId);
      const total = item.quantity * (product ? product.price : 0); // Calculate total price for each product
      return { ...item, pricePerUnit: product.price, totalPrice: total };
    });
  
    // Calculate grand total for all selected products
    const grandTotal = productsWithPrices.reduce((acc, curr) => acc + curr.totalPrice, 0);
  
    const saleData = {
      buyerName,
      date,
      products: productsWithPrices,
      grandTotal
    };
  
    console.log('Submitting sale:', saleData);
    // Here you would send 'saleData' to your server via axios or another HTTP client
    axios.post('http://localhost:4000/sale', saleData)
      .then(response => {
        navigate('/success');
      })
      .catch(error => {
        setErrorMessage('Failed to complete sale');
      });
  };
  

  return (
    <div>
      <h2>Buy Products</h2>
      <form onSubmit={handleSaleSubmit}>
        <div>
          <label htmlFor="buyerName">Buyer Name:</label>
          <input
            id="buyerName"
            type="text"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        {renderProducts()}
        <button type="submit">Purchase Products</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Sales;
