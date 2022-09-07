import React from 'react'
import { Container } from 'reactstrap'
import ThingspeakData from './thingspeakData';


import axios from 'axios';

export default function Home() {
    return (
        <div>
            <Container> 
                <div style={{textAlign:'center', marginTop:'200px'}}>
                    <ThingspeakData></ThingspeakData>
                </div>
            </Container>
        </div>
    )
}
