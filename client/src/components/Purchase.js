import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Purchase = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [sellerName, setSellerName] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:4000/getProducts');
        const productData = response.data.products;
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
            // If the field is for quantity or purchasePrice and it's empty, handle it appropriately
            let adjustedValue = value;
            if ((field === 'quantity' || field === 'purchasePrice') && value === '') {
                adjustedValue = ''; // Keep as empty string if empty
            } else if (field === 'quantity' || field === 'purchasePrice') {
                adjustedValue = parseFloat(value) || 0; // Convert to number, default to 0 if NaN
            }
            return { ...product, [field]: adjustedValue };
        }
        return product;
    });
    setSelectedProducts(updatedProducts);
};

const addOrUpdateProduct = (productId, quantity) => {
    const existingProduct = selectedProducts.find(product => product.productId === productId);
    if (existingProduct) {
        handleProductChange(productId, 'quantity', quantity === '' ? '' : parseInt(quantity));
    } else {
        const productToAdd = {
            productId,
            quantity: quantity === '' ? '' : parseInt(quantity),
            purchasePrice: '', // Start with an empty string for purchasePrice
            totalPrice: 0
        };
        setSelectedProducts([...selectedProducts, productToAdd]);
    }
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
          const purchasePrice = selectedProduct ? selectedProduct.purchasePrice : '';
          const individualPrice = selectedProduct ? purchasePrice * quantity : 0;
          grandTotal += individualPrice;

          return (
            <div key={product._id} className="product-item">
              <p>{product.name}</p>
              <p>Unit Price: ${product.price.toFixed(2)}</p>
              <input
  type="number"
  min="1"
  placeholder="Enter Quantity"
  value={quantity === 0 ? '' : quantity}  // Display empty if zero
  onChange={e => addOrUpdateProduct(product._id, e.target.value)}
/>

<input
  type="number"
  placeholder="Enter Purchase Price"
  value={purchasePrice === 0 ? '' : purchasePrice}  // Display empty if zero
  onChange={e => handleProductChange(product._id, 'purchasePrice', e.target.value)}
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
      setErrorMessage('Please select products to purchase');
      return;
    }

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

    console.log('Submitting purchase:', purchaseData);
    axios.post('http://localhost:4000/purchase', purchaseData)
      .then(response => {
        navigate('/success');
      })
      .catch(error => {
        setErrorMessage('Failed to complete purchase');
      });
  };

  return (
    <div>
      <h2>Purchase Products</h2>
      <form onSubmit={handleSaleSubmit}>
        <div>
          <label htmlFor="sellerName">Seller Name:</label>
          <input
            id="sellerName"
            type="text"
            value={sellerName}
            onChange={(e) => setSellerName(e.target.value)}
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

export default Purchase;
