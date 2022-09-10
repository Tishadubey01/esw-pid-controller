import { useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const ThingspeakInput = (props) => {
    const [angle, setAngle] = useState("");
    const [kp, setKp] = useState("");
    const [ki, setKi] = useState("");
    const [kd, setKd] = useState("");

    const onChangeAngle = (event) => {
        setAngle(event.target.value);
    };

    const onChangeKp = (event) => {
        setKp(event.target.value);
    };

    const onChangeKi = (event) => {
        setKi(event.target.value);
    };

    const onChangeKd = (event) => {
        setKd(event.target.value);
    };

    const resetInputs = () => {
        setAngle("");
        setKp("");
        setKi("");
        setKd("");
    };

    const onSubmit = (event) => {
        event.preventDefault();

        console.log("Values: ");
        console.log(angle);
        console.log(kp + " " + ki + " " + kd);
        
        // const newUser = {
        //     email: email,
        //     password: password,
        // };

        // var user_id = 0;

        // axios
        //     .post("http://localhost:5000/login", newUser)
        //     .then((response) => {
        //         user_id = response.data;
        //         alert("Logged in");
        //         console.log(response.data);
        //         localStorage.setItem('USER_ID', user_id)
        //         window.location.replace("/home")
        //     })
        //     //.catch(error => console.error(error))
        //     .catch(error => {
        //         alert("Invalid email/password");
        //         console.log(error.response.data)
        //         localStorage.setItem('USER_ID', 0)
        //     })

        resetInputs();
    };

    return (
        <Grid container align={"center"} spacing={2}>

            <Grid item xs={12}>
                <h2>Enter Motor Values</h2>
            </Grid>

            <Grid item xs={12}>
                <TextField
                    label="Angle"
                    variant="outlined"
                    value={angle}
                    onChange={onChangeAngle}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Kp"
                    variant="outlined"
                    value={kp}
                    onChange={onChangeKp}
                />
            </Grid>

            <Grid item xs={12}>
                <TextField
                    label="Ki"
                    variant="outlined"
                    value={ki}
                    onChange={onChangeKi}
                />
            </Grid>

            <Grid item xs={12}>
                <TextField
                    label="Kd"
                    variant="outlined"
                    value={kd}
                    onChange={onChangeKd}
                />
            </Grid>

            <Grid item xs={12}>
                <Button variant="contained" onClick={onSubmit}>
                    Submit
                </Button>
            </Grid>
        </Grid>
    );
};
export default ThingspeakInput;