import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Col, FormFeedback } from 'reactstrap';
import 'react-dropdown/style.css'
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import axios from 'axios';
import {setLocalStorage, deleteLocalStorage, returnLocalStorage} from "./LocalStorageHelper";

export default function Login() {
    const reg = /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+.+(?:.[a-zA-Z0-9-]))$/;
    function validate(email, password) {
        const errors = {
            email: '',
            password: '',
        };

        // EMAIL
        if (email.length === 0)
            errors.email = 'Email is required';
        else if (!reg.test(email)) {
            errors.email = 'Invalid Email';
        }

        // PASSWORD
        if ((password.length === 0)) {
            errors.password = 'Password is required';
        }
        return errors;
    }

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setLoggedIn] = useState(false);
    const data = returnLocalStorage();


    // Handling the email change
    const handleEmail = (e) => {
        setEmail(e.target.value);
    };

    // Handling the password change
    const handlePassword = (e) => {
        setPassword(e.target.value);
    };

    function handleUserSubmit() {

        if(errors.email != '' || errors.password != ''){
            console.log(errors.email, errors.password, "Hello i validation before signing up");
            alert('Please enter correct details');
        }

        axios({
            method: "POST",
            url: "http://localhost:8000/users/login",
            data: {
                email,
                password
            },
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            console.log(response);
            setLocalStorage(response.data.token,  response.data.userType);
            window.location.replace("http://localhost:3000/users/dashboard"); // move to dashboard
        }).catch(error => {
            alert(JSON.stringify(error.response));
            if (error) {
                console.log(error.response);
            }
        });

        if (isLoggedIn === true) {
            return (<Redirect to='/users/dashboard' />);
        }
    }

        let errors = validate(email,password);
        return (
            <div className="container" style={{marginTop:"40px"}}>
                <div style={{textAlign:'center', marginTop:'50px'}}>
                    <h1>Welcome to PID Control of DC motor</h1>
                </div>
                <div className="row row-content">
                    <div className="col-12 col-md-9">
                    <Form>
                        <p>Don't have an account already? <Link to='/register'><Button>Sign up</Button></Link> </p>

                        <FormGroup row>
                            <Label htmlFor="email" md={2}>Email</Label>
                            <Col md={10}>
                                <Input type="email" id="email" name="email"
                                    value={email}
                                    placeholder="Enter email"
                                    onChange={handleEmail}
                                    valid={errors.email === ''}
                                    invalid={errors.email !== ''}
                                />
                                <FormFeedback>{errors.email}</FormFeedback>
                            </Col>
                        </FormGroup>

                        <FormGroup row>
                            <Label htmlFor="password" md={2}>Password</Label>
                            <Col md={10}>
                                <Input type="password" id="password" name="password"
                                    value={password}
                                    placeholder="Enter password"
                                    onChange={handlePassword}
                                    valid={errors.password === ''}
                                    invalid={errors.password !== ''}
                                />
                                <FormFeedback>{errors.password}</FormFeedback>
                            </Col>
                        </FormGroup>

                        <FormGroup row>
                            <Col md={{ size: 3, offset: 3 }}>
                                <Button color="primary" onClick={handleUserSubmit}>
                                    Sign In 
                                </Button>
                            </Col>
                        </FormGroup>
                    </Form>
                </div>
            </div>
        </div>
        )
    
}
