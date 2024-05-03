import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/CheckSales.css"
const CheckSales = () => {
    const [sales, setSales] = useState([]);
    const [date1, setDate1] = useState(() => new Date().toISOString().slice(0, 10));
    const [date2, setDate2] = useState(() => new Date().toISOString().slice(0, 10));
    const [error, setError] = useState('');
    const [grandT, setGrandT] = useState(0); // Fixed typo 'useStae' to 'useState'
    const [grandP, setGrandP] = useState(0);
    const token=localStorage.getItem("token");

    useEffect(() => {
        async function fetchInitialSales() {
            try {
                
                const response = await axios.get('http://localhost:4000/getSales', {
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
                  });
                setSales(response.data.sales);
                setGrandT(response.data.sales.reduce((acc, sale) => acc + sale.grandTotal, 0));
                setGrandP(response.data.sales.reduce((acc, sale) => acc + sale.grandProfit, 0));
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
                },{
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
                  });
                if (response.data.sales.length > 0) {
                    setSales(response.data.sales);
                    setGrandT(response.data.sales.reduce((acc, sale) => acc + sale.grandTotal, 0));
                    setGrandP(response.data.sales.reduce((acc, sale) => acc + sale.grandProfit, 0));
                } else {
                    setSales([]); // Clear previous sales
                    setGrandT(0); // Reset grand total
                    setGrandP(0); // Reset grand profit
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
        <div className="container">
            <div className="header">Check Sales History</div>
            <p className="instructions">Select a date range to view detailed sales data.</p>
            <div className="date-selection">
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
            </div>
            {error && <p className="error-message">{error}</p>}
            {sales.length > 0 ? (
                <>
                    {sales.map((sale) => (
                        <div key={sale._id} className="sales-item">
                            <p>{sale.buyerName} - ${sale.grandTotal}</p>
                        </div>
                    ))}
                    <h4 className="total-info">Total Grand Total: ${grandT}</h4>
                    <h4 className="total-info">Total Grand Profit: ${grandP}</h4>
                </>
            ) : (
                !error && <p className="no-sales">No sales present in the selected date range.</p>
            )}
        </div>
    );
};
export default CheckSales;
