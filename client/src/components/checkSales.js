import { useEffect, useState } from "react";
import axios from "axios";

const CheckSales = () => {
    const [sales, setSales] = useState([]);
    const [date1, setDate1] = useState(() => new Date().toISOString().slice(0, 10));
    const [date2, setDate2] = useState(() => new Date().toISOString().slice(0, 10));
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchInitialSales() {
            try {
                const response = await axios.get('http://localhost:4000/getSales');
                setSales(response.data.sales);
            } catch (error) {
                console.error('Error fetching initial sales data:', error);
            }
        }
        fetchInitialSales();
    }, []);

    useEffect(() => {
        async function fetchSalesByDate() {
            if (new Date(date1) > new Date(date2)) {
                setError('Start date cannot be later than end date.');
               
                return; // Prevent further execution
            }
            setError(''); // Clear previous error messages
            try {
                const response = await axios.post('http://localhost:4000/getSales', {
                    startDate: date1,
                    endDate: date2
                });
                if (response.data.sales.length > 0) {
                    setSales(response.data.sales);
                } else {
                   
                    alert('No sales present in the selected date range.');
                }
            } catch (error) {
                console.error('Error fetching sales data based on date:', error);
            }
        }

        if (date1 && date2) {
            fetchSalesByDate();
        }
    }, [date1, date2]);

    return (
        <>
            <label htmlFor="date1">From:</label>
            <input
                id="date1"
                type="date"
                value={date1}
                onChange={(e) => setDate1(e.target.value)}
             
            />
            <label htmlFor="date2">To:</label>
            <input
                id="date2"
                type="date"
                value={date2}
                onChange={(e) => setDate2(e.target.value)}
       
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {sales.length > 0 ? (
                sales.map((sale) => (
                    <div key={sale._id}>
                        <p>{sale.buyerName} - ${sale.grandTotal}</p>
                    </div>
                ))
            ) : (
                !error && <p>No sales present in the selected date range.</p>
            )}
        </>
    );
};

export default CheckSales;
 