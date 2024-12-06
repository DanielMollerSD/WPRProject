import './styles.scss'
import React, {useRef, useEffect} from "react";
import { Link } from 'react-router-dom';
import {config} from "dotenv";
config();

function RentScreen(){

    useEffect( () => {

        async function fetchVehicles(){

            try{
                    const respone = await fetch (`${process.env.apiLink}/Vehicle`);
                    const data = await respone.json();
                    setVehicles(data);
            }
            catch(e){

                console.error(e);
            }

        }
        fetchVehicles();
    }, []);


    

    return (
        <>
        <header>Header Rent</header>

        RENT PAGE

        <footer>Footer Rent</footer>
        </>
    )
}

export default RentScreen