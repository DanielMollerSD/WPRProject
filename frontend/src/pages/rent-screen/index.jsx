import './styles.scss'
import React, {useRef, useEffect} from "react";
import { Link } from 'react-router-dom';

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
        <div className="page page-rent-screen">
            
            Rent-Screen

        </div>
    )
}

export default RentScreen