import { useEffect, useState } from "react";
import axios from "axios";

const CheckSales = () => {
    const [stock, setStock] = useState([]);
    const [date1, setDate1] = useState(() => new Date().toISOString().slice(0, 10));
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchInitialStock() {
            try {
                const response = await axios.get('http://localhost:4000/getStock');
                setStock(response.data.stock);
            } catch (error) {
                console.error('Error fetching initial sales data:', error);
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
                  
                });
                if (response.data.stock.length > 0) {
                    setStock(response.data.stock);
                } else {
                   setStock([]);
                    alert('No stock present in the selected date range.');
                }
            } catch (error) {
                console.error('Error fetching sales data based on date:', error);
            }
        }

        if (date1) {
            fetchStockByDate();
        }
    }, [date1]);

    return (
        <>
            <label htmlFor="date1">From:</label>
            <input
                id="date1"
                type="date"
                value={date1}
                onChange={(e) => setDate1(e.target.value)}
             
            />
            
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {stock.length > 0 ? (
                stock.map((s) => (
                    <div key={s._id}>
                        <p>{s.name} - {s.stock}</p>
                    </div>
                ))
            ) : (
                !error && <p>No sales present in the selected date range.</p>
            )}
        </>
    );
};

export default CheckSales;
 