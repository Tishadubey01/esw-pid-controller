import React, { useState, useMemo, useEffect } from "react";
import { BrowserRouter, Route} from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Theme, GlobalStyle } from "./theme";
import * as T from "./muiTheme";
import axios from "axios"
import Signup from "../src/components/Signup";

import UserContext from "../src/context/userContext";
import { MuiThemeProvider } from "@material-ui/core";
import Login from "./components/Login";
import UserDashboard from "./userPages/userDashboard";
import Home from "./components/home";
import UserInput from './userPages/UserInputs'

const previousState = {
    userType: localStorage.getItem("user_type"),
    token: localStorage.getItem("jwt_token"),
    user: {
        id: localStorage.getItem("user_id"),
        name: localStorage.getItem("user_name"),
        category: localStorage.getItem("user_category"),
    }
};

const initialState = {
    userType: previousState.userType ? previousState.userType : null,
    token: null || previousState.token,
    user: null || previousState.user,
    userData: null,
    // foodMenuItems: null,
    // edVals: []
};

const App = () => {

    const [data, setData] = useState(initialState);
    const providerData = useMemo(() => ({ data, setData }), [data, setData]);
    
        useEffect(() => {
            const userInfo = async () => {
                await axios
                    .get("http://localhost:8000/users/me" , {
                        headers: {
                            "Authorization": data.token,
                        },
                    })
                    .then((res) => {
                        setData({
                            ...data,
                            auth: "AUTHENTICATED",
                            userData: res.data
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            
            userInfo()
        }
    }, []);
    


    return (

        <ThemeProvider theme={Theme}>
            <MuiThemeProvider theme={T.theme}>
                <GlobalStyle />
                <BrowserRouter>
                    <UserContext.Provider value={providerData}>
                        <Route exact path="/" component={Login} />
                        <Route path="/users/thingspeak" component={Home} />
                        <Route exact path="/users/dashboard" component={UserDashboard} />
                        <Route path="/register" component={Signup} />
                        <Route path="/input" component={UserInput} />
                    </UserContext.Provider>
                </BrowserRouter>
            </MuiThemeProvider>
        </ThemeProvider>
    );
};

export default App;

//removed proxy
// "proxy": "http://localhost:3000",