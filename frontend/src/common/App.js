import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import "./App.css";

import Navbar from "./Navbar";
import Login from "../user/Login";
import SignUp from "../user/SignUp";
import Home from "./Home";
import SlotBooking from "../user/slotBooking";

const Layout = () => {
  return (
    <div>
      <Navbar />
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="signup" element={<SignUp />} />
          {/* <Route path="login" element={<Login />} /> */}
          <Route path="slotbooking" element={<SlotBooking />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;