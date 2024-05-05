import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Purchase.css';  // Ensure this CSS matches the Sales.css for UI consistency

const Purchase = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [sellerName, setSellerName] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://stockit-2.onrender.com/getStock', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setProducts(response.data.stock);
      } catch (error) {
        toast.error('Failed to fetch products');
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleProductChange = (productId, field, value) => {
    const updatedProducts = selectedProducts.map(product => {
      if (product.productId === productId) {
        let adjustedValue = value; // Assume string input for generality
        if (field === 'quantity') {
          adjustedValue = parseInt(value, 10); // Convert to integer, default to 0 on failure
        } else if (field === 'purchasePrice') {
          adjustedValue = parseFloat(value); // Convert to float, default to 0 on failure
        }
        return { ...product, [field]: isNaN(adjustedValue) ? '' : adjustedValue };
      }
      return product;
    });
    setSelectedProducts(updatedProducts);
  };
  
  

  const addOrUpdateProduct = (productId, quantity) => {
    const existingProduct = selectedProducts.find(product => product.productId === productId);
    if (existingProduct) {
      handleProductChange(productId, 'quantity', quantity);
    } else {
      const productDetails = products.find(p => p._id === productId);
      const productToAdd = {
        productId,
        quantity: parseInt(quantity, 10),
        purchasePrice: '',  // Assuming starting with list price
        totalPrice: 0
      };
      setSelectedProducts([...selectedProducts, productToAdd]);
    }
  };

  const handlePurchaseSubmit = (event) => {
    event.preventDefault();
    const productsWithPrices = selectedProducts.map(item => {
      const product = products.find(p => p._id === item.productId);
      const total = item.quantity * item.purchasePrice;
      return { ...item, productName: product.name, pricePerUnit: item.purchasePrice, totalPrice: total };
    });

    const grandTotal = productsWithPrices.reduce((acc, curr) => acc + curr.totalPrice, 0);

    const purchaseData = {
      sellerName,
      date,
      products: productsWithPrices,
      grandTotal
    };

    axios.post('https://stockit-2.onrender.com/purchase', purchaseData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        toast.success('Purchase added successfully');
        navigate('/home/checkPurchases');
      })
      .catch(error => {
        toast.error('Failed to complete purchase');
        console.error('Error during purchase:', error);
      });
  };

  const renderProducts = () => {
    return (
      <table className="product-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Unit Price</th>
            <th>Quantity</th>
            <th>Purchase Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => {
            const selectedProduct = selectedProducts.find(item => item.productId === product._id);
            const quantity = selectedProduct ? selectedProduct.quantity : '';
            const purchasePrice = selectedProduct ? selectedProduct.purchasePrice :'';
            const individualPrice = quantity * purchasePrice;
            return (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    placeholder="Enter Quantity"
                    value={quantity}
                    onChange={e => addOrUpdateProduct(product._id, e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    placeholder="Enter Purchase Price"
                    value={purchasePrice}
                    onChange={e => handleProductChange(product._id, 'purchasePrice', e.target.value)}
                  />
                </td>
                <td>${individualPrice.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div className="purchase-container">
      <ToastContainer />
      <h2>Purchase Products</h2>
      <form onSubmit={handlePurchaseSubmit}>
        <div>
          <label htmlFor="sellerName">Seller Name:</label>
          <input id="sellerName" type="text" value={sellerName} onChange={e => setSellerName(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="date">Date:</label>
          <input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        {renderProducts()}
        <button type="submit">Purchase Products</button>
      </form>
    </div>
  );
};

export default Purchase;
