import React, { useContext, useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import UserContext from '../context/userContext'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PaidIcon from '@mui/icons-material/Paid';
import { Form, FormGroup, Label, Input, Col, FormFeedback } from 'reactstrap';
import IconButton from '@mui/material/IconButton';
import { returnLocalStorage } from "../components/LocalStorageHelper";

export default function UserDetails() {
    const { data, setData } = useContext(UserContext);
    const tokenData = returnLocalStorage().token;

    

    // const addMoneyToWallet = () => {
    //     fetch("http://localhost::8000/buyers/addmoney", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Authorization": tokenData,
    //         }, body: JSON.stringify({
    //             walletMoney: money
    //         })
    //     })
    //         .then((res) => {
    //             if (res.error || res.status != 200) {
    //                 console.log(res)
    //                 alert(res.error);
    //             }
    //             else {
    //                 alert("Money added successfully!");
    //                 window.location.replace("http://localhost:3000/buyers/dashboard");
    //             }
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // }


    return (
        <div>
            {data.userData === null ? "Loading..." :
                <div>
                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <AccountCircleIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Name" secondary={data.userData.name} />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <EmailIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Email" secondary={data.userData.email} />
                        </ListItem>
                        
                        
                    </List>
                </div>
            }
        </div>
    );
}

