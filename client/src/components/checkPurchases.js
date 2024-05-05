import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/CheckPurchases.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CheckPurchases = () => {
    const [purchases, setPurchases] = useState([]);
    const [selectedPurchaseId, setSelectedPurchaseId] = useState(null);
    const [date1, setDate1] = useState(null);
    const [date2, setDate2] = useState(null);
    const [error, setError] = useState('');
    const [grandT, setGrandT] = useState(0);
    const token = localStorage.getItem("token");

    useEffect(() => {
        async function fetchInitialPurchases() {
            try {
                const response = await axios.get('https://stockit-1.onrender.com/getPurchases', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setPurchases(response.data.purchases);
                setGrandT(response.data.purchases.reduce((acc, purchase) => acc + purchase.grandTotal, 0));
            } catch (error) {
                console.error('Error fetching initial purchases data:', error);
                toast.error("Error fetching purchases data.");
            }
        }
        fetchInitialPurchases();
    }, []);

    useEffect(() => {
        async function fetchPurchasesByDate() {
            if (new Date(date1) > new Date(date2)) {
                setError('Start date cannot be later than end date.');
                return;
            }
            setError('');
            try {
                const response = await axios.post('https://stockit-1.onrender.com/getPurchases', {
                    startDate: date1,
                    endDate: date2
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.data.purchases.length > 0) {
                    setPurchases(response.data.purchases);
                    setGrandT(response.data.purchases.reduce((acc, purchase) => acc + purchase.grandTotal, 0));
                } else {
                    setPurchases([]);
                    setGrandT(0);
                   
                }
            } catch (error) {
                console.error('Error fetching purchases data based on date:', error);
                toast.error("Error fetching purchases data.");
            }
        }

        fetchPurchasesByDate();
    }, [date1, date2]);

    const togglePurchaseDetails = (purchaseId) => {
        if (selectedPurchaseId === purchaseId) {
            setSelectedPurchaseId(null);
        } else {
            setSelectedPurchaseId(purchaseId);
        }
    };

    return (
        <div className="container">
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
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
                        <div key={purchase._id} className="purchase-item" onClick={() => togglePurchaseDetails(purchase._id)}>
                            <p>{purchase.sellerName} - ${purchase.grandTotal}</p>
                            {selectedPurchaseId === purchase._id && (
                                <div className="purchase-details">
                                    <h3>Transaction Details</h3>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Product Name</th>
                                                <th>Quantity</th>
                                                <th>Price Per Unit</th>
                                                <th>Total Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {purchase.items.map(item => (
                                                <tr key={item._id}>
                                                    <td>{item.productName}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>${item.pricePerUnit.toFixed(2)}</td>
                                                    <td>${(item.totalPrice.toFixed(2))}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <button onClick={() => setSelectedPurchaseId(null)}>Close Details</button>
                                </div>
                            )}
                        </div>
                    ))}
                    <h4 className="total-info">Total Grand Total: ${grandT.toFixed(2)}</h4>
                </>
            ) : (
                !error && <p className="no-purchases">No purchases present in the selected date range.</p>
            )}
        </div>
    );
};

export default CheckPurchases;
