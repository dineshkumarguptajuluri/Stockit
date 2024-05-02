//import Login from "./components/Login";
import { Route,Routes } from "react-router-dom";
//import CheckSales from "./components/checkSales";
//import CheckPurchases from "./components/checkPurchases";
// import Signup from "./components/Signup"
// import Home from "./components/Home";
//import AddProduct from "./components/AddProduct";
import Sales from "./components/Sales";

//import CheckStock from "./components/checkStock";
//import Purchase from "./components/Purchase";
function App() {
  return (
    <div>

<Routes>
{/* <Route path="/success" element={<Login />} /> */}
<Route path="/" element={<Sales/>}/>
{/* <Route path="/signup" element={<Signup/>}/>
<Route path="/home" element={<Home/>}/> */}
</Routes>
    </div>
  );
}

export default App;
