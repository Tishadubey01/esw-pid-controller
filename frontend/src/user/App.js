import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import "./App.css";

import Navbar from "../user/Navbar";
import Login from "../user/Login";
import SignUp from "../user/SignUp";
import Home from "../user/Home";
import Logout from "../user/Logout";
import ThingspeakInput from "./thingspeakInput";

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
          {/* <Route path="signup" element={<SignUp />} /> */}
          {/* <Route path="login" element={<Login />} /> */}
          <Route path="thingspeakdata" element={<ThingspeakInput />} />
          <Route path="logout" element={<Logout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;