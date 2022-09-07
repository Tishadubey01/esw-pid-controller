import { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Col, FormFeedback, Alert } from 'reactstrap';
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import { Link } from 'react-router-dom';

export default function Signup() { 
    const reg= /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+.+(?:.[a-zA-Z0-9-]))$/;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    

    function validate(name,email, password) {

        const errors={
            name:'',
            email: '',
            password: '',
        };

        // NAME
        if((name.length === 0)){
            errors.name='Name is required';
        }

        // EMAIL
        if (email.length === 0)
            errors.email = 'Email is required';
        else if(!reg.test(email)){
            errors.email='Invalid Email';
        }

        // PASSWORD
        if((password.length===0)){
            errors.password='Password is required';
        }
    }

    // States for checking the errors
    const [error, setError] = useState(null);

    // Handling the name change
    const handleName = (e) => {
        setName(e.target.value);
    };

    // Handling the email change
    const handleEmail = (e) => {
        setEmail(e.target.value);
    };

    // Handling the password change
    const handlePassword = (e) => {
        setPassword(e.target.value);
    };


    // Handling the form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:8000/users/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                password,
                email
            })
        }).then((response) => {
            if (response.error || response.status != 200) {
                console.log(response)
                setError(response.error);
            }
            else {
                alert("Successfully registered");
                window.location.replace("http://localhost:3000/");
            }
        }).catch(error => {
            alert("Oops, Something went wrong!!");
            if (error) {
                console.log(error);
                setError(error);
            }
        });
    };



    let errors = validate(name,email, password);
    return (
        <div className="container">
            <div className="row row-content">
                <div className="col-12 col-md-9">
                    <p>Already have an account? <Link to='/'><Button>Log in</Button></Link> </p>
                    <Form>
                        
                    <FormGroup row>
                        <Label htmlFor="name" md={2}>Name</Label>
                        <Col md={10}>
                            <Input type="name" id="name" name="name"
                            value={name}
                            placeholder="Enter name"
                            onChange={handleName}
                            valid={errors.name === ''}
                            invalid={errors.name !== ''}
                            />
                            <FormFeedback>{errors.name}</FormFeedback>
                        </Col>
                    </FormGroup>

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
                
                        <Button onClick={handleSubmit} className="btn" color="primary" type="submit"> Submit</Button>
                    </Form>
                </div>
            </div>
        </div>

    );
}