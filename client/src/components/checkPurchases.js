import { useEffect, useState } from "react";
import axios from "axios";
import '../styles/CheckPurchases.css';

const CheckPurchases = () => {
    const [purchases, setPurchases] = useState([]);
    const [date1, setDate1] = useState(() => new Date().toISOString().slice(0, 10));
    const [date2, setDate2] = useState(() => new Date().toISOString().slice(0, 10));
    const [error, setError] = useState('');
    const [grandT, setGrandT] = useState(0);
    const token=localStorage.getItem("token");

    useEffect(() => {
        async function fetchInitialPurchases() {
            try {
                const token=localStorage.getItem("token");
                const response = await axios.get('http://localhost:4000/getPurchases',{
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
                  });
                setPurchases(response.data.purchases);
                setGrandT(response.data.purchases.reduce((acc, purchase) => acc + purchase.grandTotal, 0));
            } catch (error) {
                console.error('Error fetching initial purchases data:', error);
            }
        }
        fetchInitialPurchases();
    }, []);

    useEffect(() => {
        async function fetchPurchasesByDate() {
            if (new Date(date1) > new Date(date2)) {
                setError('Start date cannot be later than end date.');
                return; // Prevent further execution
            }
            setError(''); // Clear previous error messages
            try {
                const token=localStorage.getItem("token");
                const response = await axios.post('http://localhost:4000/getPurchases', {
                    startDate: date1,
                    endDate: date2
                },{
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
                  });
                if (response.data.purchases.length > 0) {
                    setPurchases(response.data.purchases);
                    setGrandT(response.data.purchases.reduce((acc, purchase) => acc + purchase.grandTotal, 0));
                } else {
                    setPurchases([]); // Clear previous purchases data
                    setGrandT(0); // Reset total grand total
                    alert('No purchases present in the selected date range.');
                }
            } catch (error) {
                console.error('Error fetching purchases data based on date:', error);
            }
        }

        if (date1 && date2) {
            fetchPurchasesByDate();
        }
    }, [date1, date2,token]);

    return (
        <div className="container">
            <div className="header">Check Purchase History</div>
            <p className="instructions">Select a date range to view purchases.</p>
            <div className="date-inputs">
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
            {purchases.length > 0 ? (
                <>
                    {purchases.map((purchase) => (
                        <div key={purchase._id} className="purchase-item">
                            <p>{purchase.sellerName} - ${purchase.grandTotal}</p>
                        </div>
                    ))}
                    <h4 className="total-grand-total">Total Grand Total: ${grandT}</h4>
                </>
            ) : (
                !error && <p className="no-purchases">No purchases present in the selected date range.</p>
            )}
        </div>
    );
};
export default CheckPurchases;
