import { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import styles from "./thingspeakInput.module.css";
import ReactPlayer from "react-player"

const ThingspeakInput = (props) => {
    const [angle, setAngle] = useState("");
    const [kp, setKp] = useState("");
    const [ki, setKi] = useState("");
    const [kd, setKd] = useState("");
    // const [currangle, setCurrangle] = useState([]);
    // const [time, setTime] = useState([]);

    // useEffect(() => {
    //     axios.get("https://api.thingspeak.com/channels/1853807/fields/1.json?results=2").then((response) => {
    //         console.log(response);
    //         setCurrangle(response.field5);
    //         setAngle(response.field1)
    //     });
    //   }, []);

      
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

    // useEffect(() => {
    //     axios.get("https://api.thingspeak.com/channels/1853807/fields/1.json").then((response) => {
    //         console.log(response);
    //         setAngle(current => [...current, 'Carl']);
    //         console.log(response.data.feeds.field1)
    //     });
    //     axios.get("https://api.thingspeak.com/channels/1853807/fields/5.json").then((response) => {
    //         console.log(response);
    //         console.log(response.data.feeds.field5);
    //         // setCurrangle(response.field5);
    //     });
    //   }, []);

    const onSubmit = (e) => {
        e.preventDefault();
        console.log(e);
        fetch('https://api.thingspeak.com/update.json', {
           method: 'POST',
           body: JSON.stringify({
               api_key: "HBOKWG0WPO91090S",
               field1: angle,
               field2: kp, 
               field3: ki,
               field4: kd
           }),
           headers: {
              'Content-type': 'application/json; charset=UTF-8',
           },
        })


        resetInputs();
    };

    return (
        <div className={styles.float_container}>
            <div className={styles.float_child1}>
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
            </div>
            <div className={styles.float_child2}>
                {/* <iframe
                    src="https://player.twitch.tv/?channel=tishadubey01"
                    height="100%"
                    width="100%"
                    allowFullScreen={true}
                    scrolling="no"
                    parent={"www.example.com"}
                >
                </iframe> */}
                <ReactPlayer
                    url="https://www.twitch.tv/tishadubey01"
                    controls
                />
            </div>
        </div>
    );
};
export default ThingspeakInput;