
import React, { useState, useEffect } from 'react';

import axios from 'axios';

const CheckStock=()=>{
const [products,setProducts]=useState([]);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:4000/getProducts');
      const productData = response.data.products;
      setProducts(productData);
    } catch (error) {
      console.error('Error fetching products:', error);
    
    }
  };
  fetchProducts();
}, []);
return(<div>
  {products.map((product)=>{
      return(<div key={product._id}>
        <p>{product.name} {product.stock}</p>
      </div>)
})}
</div>)
}
export default CheckStock;