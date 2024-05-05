import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Make sure to import the CSS
import '../styles/AddProduct.css'; // Ensure your CSS file is named and imported correctly

const AddProduct = () => {
  const initialState = {
    name: '',
    price: 0,
    description: '',
    errors: {},
  };

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [productData, setProductData] = useState(initialState);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProductData(prevData => ({
      ...prevData,
      [name]: value,
      errors: { ...prevData.errors, [name]: undefined },
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    if (!productData.name) {
      isValid = false;
      errors.name = 'Name is required';
    }

    if (!productData.price) {
      isValid = false;
      errors.price = 'Price is required';
    } else if (isNaN(productData.price)) {
      isValid = false;
      errors.price = 'Price must be a number';
    }

    if (!productData.description) {
      isValid = false;
      errors.description = 'Description is required';
    }

    setProductData(prevData => ({ ...prevData, errors }));
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error('Please correct the errors in the form.');
      return; // Don't submit if form is invalid
    }

    try {
      const username = 'karthik';
      const data = { ...productData, username };
      const response = await axios.post('https://stockit-1.onrender.com/addproduct', data, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success('Product successfully added');
        navigate('/home');
      } else {
        toast.error('Product addition failed');
      }
    } catch (error) {
      toast.error('An error occurred while adding the product');
    }
    setProductData(initialState); // Clear form after successful submission
  };

  return (
    <div className="container">
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <form onSubmit={handleSubmit}>
        <h2>Add Product</h2>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={productData.name}
            onChange={handleChange}
            required
          />
          {productData.errors.name && <p className="error-message">{productData.errors.name}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={productData.price}
            onChange={handleChange}
            required
          />
          {productData.errors.price && <p className="error-message">{productData.errors.price}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={productData.description}
            onChange={handleChange}
            required
          />
          {productData.errors.description && <p className="error-message">{productData.errors.description}</p>}
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
