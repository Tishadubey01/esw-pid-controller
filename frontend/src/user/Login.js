import { useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const Login = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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

    const onSubmit = (event) => {
        event.preventDefault();

        const newUser = {
            email: email,
            password: password,
        };

        var user_id = 0;

        axios
            .post("http://localhost:5000/login", newUser)
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
                <h2>LOGIN</h2>
            </Grid>

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
                    Login
                </Button>
            </Grid>
        </Grid>
    );
};
export default Login;