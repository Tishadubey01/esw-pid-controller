//import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import "./App.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import LoginPage from "./common/Login";
import Navbar from "./common/Navbar";
import AppPage from "./common/App";


function App() {
  const [ID, setID] = useState("0");
  //const [type, setType] = useState("0")

  useEffect(() => {

    // Update the document title using the browser API
    let a = localStorage.getItem('USER_ID')
    console.log("a:", a)
    if (!a || a == 0 || a == "") { setID("0"); localStorage.setItem('USER_ID', ''); }
    else {
      setID(a)
      axios.get('http://localhost:4000/user/' + a)
        .then(response => {
          //setType(response.data.type)
          if (response.data == "") { setID("0"); localStorage.setItem('USER_ID', ''); }
          console.log(setID);
        })
    }
  }, []);
  if (ID == "0") {
    return (
      <AppPage />
    );
  }
  else {
    console.log("USER SET");
  }

}


export default App;