import { useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useEffect } from "react";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const SlotBooking = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [allslots, setAllslots] = useState([]);
    const [selectslot, setSelectslot] = useState("");

    useEffect(() => {
        axios
          .get("http://localhost:5000/getfreeslots")
          .then((res) => {
            // console.log(res.data)
            setAllslots(res.data)
          })
          
      }, [])
    
    
    

    const handleChange = (event) => {
        setSelectslot(event.target.value );
    };
    
    const onChangeEmail = (event) => {
        setEmail(event.target.value);
    };

    const onChangePassword = (event) => {
        setPassword(event.target.value);
    };

    const resetInputs = () => {
        setEmail("");
        setPassword("");
    };

    const getAllSlots = (event) => {
        event.preventDefault();
        axios
            .get("http://localhost:5000/createslots")
            .then((response) => {
                console.log(response.data);
            })
            .catch(error => {
                console.log(error.response.data)
            })

        resetInputs();
    };

    const onSubmit = (event) => {
        event.preventDefault();

        const newUser = {
            email: email,
            password: password,
            slotId: selectslot
        };

        var user_id = 0;

        axios
            .post("http://localhost:5000/assignslots", newUser)
            .then((response) => {
                user_id = response.data;
                alert("Logged in");
                console.log(response.data);
                localStorage.setItem('USER_ID', user_id)
                window.location.replace("/home")
            })
            //.catch(error => console.error(error))
            .catch(error => {
                alert("Invalid email/password");
                console.log(error.response.data)
                localStorage.setItem('USER_ID', 0)
            })

        resetInputs();
    };

    return (
        <Grid container align={"center"} spacing={2}>

            <Grid item xs={12}>
                <h2>SLOT BOOKING</h2>
            </Grid>

            <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Slots</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectslot}
                label="Slots"
                onChange={handleChange}
            >

                {allslots.map((item) => {
                    if (item != null) {
                    return <MenuItem  value={item.slotId}>{item.start + "-" + item.end}</MenuItem>;

                    }

                    return null;
                })}
            </Select>
            </FormControl>
            
            <br></br>
            <br></br>
            

            <Grid item xs={12}>
                <TextField
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={onChangeEmail}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Password"
                    variant="outlined"
                    value={password}
                    onChange={onChangePassword}
                />
            </Grid>

            <Grid item xs={12}>
                <Button variant="contained" onClick={onSubmit}>
                    Submit Booking
                </Button>
            </Grid>
        </Grid>
    );
};
export default SlotBooking;