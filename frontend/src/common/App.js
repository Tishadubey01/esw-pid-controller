import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import "./App.css";

import Navbar from "../common/Navbar";
import Login from "../common/Login";
import SignUp from "../common/SignUp";

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
          <Route path="signup" element={<SignUp />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;