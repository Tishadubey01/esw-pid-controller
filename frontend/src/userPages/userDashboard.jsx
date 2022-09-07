import React, {useContext, useEffect} from 'react';
import UserContext from '../context/userContext';
import { returnLocalStorage } from "../components/LocalStorageHelper";
import UserNavBar from './UserNavbar';
import axios from 'axios';
import UserDetails from './UserDetails';

function UserDashboard() {

    const { data, setData } = useContext(UserContext);
    const loginDetails = returnLocalStorage();

    console.log(data);
    console.log(loginDetails.token, loginDetails.userType);

    
    let path = "users";

        useEffect(() => { // whenever page reloads, called only once OR code will run if values inside array change
            if (path != null) {
            const userInfo = async () => {
                await axios // await - asynchronous call, axios - ability to make HTTP requests from the browser
                    .get("http://localhost:8000/" + path + "/me", {
                        headers: {
                            "Authorization": data.token,
                            "Content-Type": "application/json"
                        },
                    })
                    .then((res) => {
                        console.log(res.data);
                        setData({
                            ...data, // spread operator
                            auth: "AUTHENTICATED",
                            userData: res.data
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
            userInfo()
        }
    }, []);

    return (
        <div>
            <UserNavBar></UserNavBar>
            <div align="center" style={{margin:"40px"}}>
                <UserDetails></UserDetails>
            </div>
            
        </div>
    )
}

export default UserDashboard;

