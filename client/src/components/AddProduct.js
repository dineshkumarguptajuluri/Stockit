import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProduct = ({ onSubmit }) => {
  const initialState = {
    name: '',
    price: 0,
    description: '',
   // For file upload
    errors: {},
  };
  const navigate=useNavigate();

  const [productData, setProductData] = React.useState(initialState);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
      errors: { ...prevData.errors, [name]: undefined }, // Clear error on change
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

    setProductData((prevData) => ({ ...prevData, errors }));
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return; // Don't submit if form is invalid
    }

   try{
    const username='karthik';
    const daata={...productData,username};
    console.log(daata);
    const response =await axios.post('http://localhost:4000/addproduct',daata) ;
    if (response.data.success) { // Assuming response has a success property
        // Handle successful login
        alert('product is succesfully added');
        navigate('/home');
    
        // Redirect to home page or perform other actions based on successful login
      } else {
        alert('Product is not added'); // Set error message
      }

   }
   catch(error){

   }
    setProductData(initialState); // Clear form after successful submission
  };

  return (
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
  );
};

export default AddProduct;
