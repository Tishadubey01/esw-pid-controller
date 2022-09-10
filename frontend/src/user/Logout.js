import React from 'react'
import Grid from "@mui/material/Grid";

function Logout(props) {
    localStorage.removeItem('USER_ID')      //reseting user
    localStorage.setItem('USER_ID', "")
    return (
        <Grid container align={"center"} spacing={2}>

            <Grid item xs={12}>
                <h2>Logged out</h2>
                <a href="/slotbooking"><p>Login page</p></a>
            </Grid>
        </Grid>
    )
}
export default Logout;