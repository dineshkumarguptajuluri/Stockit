import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Sales = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [buyerName, setBuyerName] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const navigate = useNavigate();
  const token=localStorage.getItem("token");
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
       
        const response = await axios.get('http://localhost:4000/getStock',{
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(response.data.stock)
        const productData = response.data.stock;
        setProducts(productData);
      } catch (error) {
        console.error('Error fetching products:', error);
        setErrorMessage('Failed to fetch products');
      }
    };
    fetchProducts();
  }, []);

  const handleProductChange = (productId, field, value) => {
    const updatedProducts = selectedProducts.map(product => {
        if (product.productId === productId) {
            if (field === 'quantity') {
                const productDetails = products.find(p => p._id === productId); // Assuming 'products' holds your entire product catalog with 'stock'
                const quantity = parseInt(value, 10); // Convert input to integer

                if (!isNaN(quantity) && productDetails && quantity > productDetails.stock) {
                    setErrorMessage(`Quantity exceeds available stock. Only ${productDetails.stock} items available.`);
                    return { ...product, quantity: '' }; // Reset the quantity field
                } else {
                    setErrorMessage(''); // Clear any previous error message
                    return { ...product, quantity: value === '' ? '' : quantity }; // Update normally if within stock limits
                }
            } else if (field === 'salePrice') {
                // Handle sale price similarly but without the stock check
                const updatedValue = value === '' ? '' : parseFloat(value);
                return { ...product, [field]: updatedValue };
            }
            return product; // If neither salePrice nor quantity, just return the existing product
        }
        return product;
    });

    setSelectedProducts(updatedProducts);
};



const addOrUpdateProduct = (productId, quantity) => {
  const existingProduct = selectedProducts.find(product => product.productId === productId);
  if (existingProduct) {
      handleProductChange(productId, 'quantity', quantity === '' ? '' : parseInt(quantity, 10));
  } else {
      const productToAdd = {
          productId,
          quantity: quantity === '' ? '' : parseInt(quantity, 10),
          salePrice: '', // Initialize with an empty string for salePrice
          totalPrice: 0
      };
      setSelectedProducts([...selectedProducts, productToAdd]);
  }
};

  

  const renderProducts = () => {
    let grandTotal = 0;

    if (!products.length) {
      return <p>Loading products...</p>;
    }
    return (
      <>
        {products.map((product) => {
          const selectedProduct = selectedProducts.find(
            item => item.productId === product._id
          );
          const quantity = selectedProduct ? selectedProduct.quantity : 0;
          const salePrice = selectedProduct ? selectedProduct.salePrice : product.price; // Default to product price if not set
          const individualPrice = salePrice * quantity;
          grandTotal += individualPrice;

          return (
            <div key={product._id} className="product-item">
              <p>{product.name}</p>
              <p>List Price: ${product.price.toFixed(2)}</p>
              <input
                type="number"
                min="0"
                placeholder="Enter Quantity"
                value={quantity}
                onChange={e => addOrUpdateProduct(product._id, e.target.value)}
              />
              <input
                type="number"
                placeholder="Enter Sale Price"
                value={salePrice}
                onChange={e => handleProductChange(product._id, 'salePrice', e.target.value)}
              />
              <p>Total: ${individualPrice.toFixed(2)}</p>
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
    event.preventDefault();
    if (!selectedProducts.length) {
      setErrorMessage('Please select products to sell');
      return;
    }

    const productsWithPrices = selectedProducts.map(item => {
      const product = products.find(p => p._id === item.productId);
      const total = item.quantity * item.salePrice;
      return { ...item, productName: product.name, pricePerUnit: product.price, totalPrice: total };
    });

    const grandTotal = productsWithPrices.reduce((acc, curr) => acc + curr.totalPrice, 0);

    const saleData = {
      buyerName,
      date,
      products: productsWithPrices,
      grandTotal
    };
    console.log('Submitting sale:', saleData);
    axios.post('http://localhost:4000/sale', saleData,{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        navigate('/success');
      })
      .catch(error => {
        setErrorMessage('Failed to complete sale');
      });
  };

  return (
    <div>
      <h2>Sell Products</h2>
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
        <button type="submit">Sell Products</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Sales;
