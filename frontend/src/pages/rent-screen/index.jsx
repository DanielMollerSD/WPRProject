import './styles.scss'
import React, {useRef, useEffect, useState} from "react";
import { Link } from 'react-router-dom';
import {config} from "dotenv";
config();

function RentScreen(){

    const [Vehicle, setVehicles]= useState ([]);

    useEffect( () => {

        async function fetchVehicles(){

            try{
                    const response = await fetch (`${process.env.apiLink}/Vehicle`);
                    const data = await respone.json();
                    setVehicles(data);
            }
            catch(e){

                console.error(e);
            }

        }
        fetchVehicles();
    }, []);

    const renderVehicleBoxes = () =>{
        return Vehicle.map((Vehicle)=>{
            if (Vehicle.soort === "Auto"){

           
                return <RentalAutoBox key={Vehicle.Id} data={Vehicle} />;
            }
            else if(Vehicle.soort ==="Camper"){

                return <RentalAutoBox key={Vehicle.Id} data={Vehicle}/>;
                
            }

        })
    }
    
    

    return (

        
        <>
        <header>Header Rent</header>

        RENT PAGE

        <footer>Footer Rent</footer>
        </>
    )
}

export default RentScreen