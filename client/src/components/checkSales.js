import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/CheckSales.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const CheckSales = () => {
    const [sales, setSales] = useState([]);
    const [selectedSaleId, setSelectedSaleId] = useState(null);
    const [date1, setDate1] = useState(null);
    const [date2, setDate2] = useState(null);
    const [error, setError] = useState('');
    const [grandT, setGrandT] = useState(0);
    const [grandP, setGrandP] = useState(0);
    const token = localStorage.getItem("token");

    useEffect(() => {
        async function fetchInitialSales() {
            try {
                const response = await axios.get('https://stockit-slgj-dinesh-kumars-projects-8a49feb8.vercel.app/getSales', {
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
                });
                setSales(response.data.sales);
                setGrandT(response.data.sales.reduce((acc, sale) => acc + sale.grandTotal, 0));
                setGrandP(response.data.sales.reduce((acc, sale) => acc + sale.grandProfit, 0));
            } catch (error) {
                console.error('Error fetching initial sales data:', error);
                toast.error("Error fetching sales data.");
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
            setError('');
            try {
                const response = await axios.post('https://stockit-slgj-dinesh-kumars-projects-8a49feb8.vercel.app/getSales', {
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
                    setSales([]);
                    setGrandT(0);
                    setGrandP(0);
                    toast.info('No sales present in the selected date range.');
                }
            } catch (error) {
                console.error('Error fetching sales data based on date:', error);
                toast.error("Error fetching sales data.");
            }
        }

        if (date1 && date2) {
            fetchSalesByDate();
        }
    }, [date1, date2]);

    const toggleSaleDetails = (saleId) => {
        if (selectedSaleId === saleId) {
            setSelectedSaleId(null); // Toggle off if the same sale is clicked again
        } else {
            setSelectedSaleId(saleId);
        }
    };

    return (
        <div className="container">
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
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
                        <div key={sale._id}>
                            <div className="sales-item" onClick={() => toggleSaleDetails(sale._id)}>
                                <p>{sale.buyerName} - ${sale.grandTotal}</p>
                            </div>
                            {selectedSaleId === sale._id && (
                                <div className="sale-details">
                                    <h3>Transaction Details</h3>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Product Name</th>
                                                <th>Quantity</th>
                                                <th>Price Per Unit</th>
                                                <th>Total Price</th>
                                                <th>Total Profit</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sale.items.map(item => (
                                                <tr key={item._id}>
                                                    <td>{item.productName}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>${item.salePrice}</td>
                                                    <td>${item.totalPrice}</td>
                                                    <td>${item.totalProfit}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <button onClick={() => setSelectedSaleId(null)}>Close Details</button>
                                </div>
                            )}
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
