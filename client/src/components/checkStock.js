import React, { useEffect, useState } from 'react';
import axios from 'axios';
 // Ensure this CSS file is linked correctly
import styles from '../styles/CheckStock.module.css';
const CheckStock = () => {
    const [stock, setStock] = useState([]);
    const [date1, setDate1] = useState(() => new Date().toISOString().slice(0, 10));
    const [error, setError] = useState('');
    const token = localStorage.getItem("token");

    useEffect(() => {
        async function fetchInitialStock() {
            try {
                const response = await axios.get('http://localhost:4000/getStock', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setStock(response.data.stock);
            } catch (error) {
                console.error('Error fetching initial stock data:', error);
            }
        }
        fetchInitialStock();
    }, []);

    useEffect(() => {
        async function fetchStockByDate() {
            setError(''); // Clear previous error messages
            try {
                const response = await axios.post('http://localhost:4000/getStock', {
                    startDate: date1,
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.data.stock.length > 0) {
                    setStock(response.data.stock);
                } else {
                    setStock([]);
                    alert('No stock present for the selected date.');
                }
            } catch (error) {
                console.error('Error fetching stock data based on date:', error);
            }
        }

        if (date1) {
            fetchStockByDate();
        }
    }, [date1]);

    return (
        <div className={styles.checkStockContainer}>
        <div className="container" >
            <div className="header">Product Current Stock</div>
            <p className="instructions">Select a date to view the stock levels of products.</p>
            <div className="date-selection">
              
                <input
                    id="date1"
                    type="date"
                    value={date1}
                    onChange={(e) => setDate1(e.target.value)}
                />
            </div>
            {error && <p className="error-message">{error}</p>}
            {stock.length > 0 ? (
                stock.map((s) => (
                    <div key={s._id} className="stock-item">
                        <p>{s.name} - {s.stock} units</p>
                    </div>
                ))
            ) : (
                !error && <p className="no-stock">No stock present for the selected date.</p>
            )}
        </div>
      </div>
        
    );
};

export default CheckStock;
