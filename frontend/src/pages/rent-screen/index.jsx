import './styles.scss'
import React, {useRef, useEffect, useState} from "react";
import { Link } from 'react-router-dom';

function RentScreen(){

    useEffect( () => {


        const empdata = {

            
            Id: 1,
            Brand: BMW,
            Model: M3

        }
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
            <div className="container">
                <div className="rent-screen-content">

                    <div className="vehicle-select">
                        Selecteer een voertuig type:
                        <select name="vehicleType" id="vehicleType">
                            <option value="cars">Auto</option>
                            <option value="campers">Camper</option>
                            <option value="caravan">Caravan</option>
                        </select>
                    </div>
                
                    <div className="cards-container">
                        <div className="row">

                            <div className="col-md-6 col-lg-4">
                                <a href="#">
                                    <div className="card">
                                        <img className="card-img-top" src="" alt="Card image"></img>
                                        <div className="card-body">
                                            <h5 className="card-title">Auto</h5>
                                            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                            <div className="icons">
                                                <div className="icon">Type</div>
                                                <div className="icon">Merk</div>
                                                <div className="icon">Model</div>
                                                <div className="icon">Koop Jaar</div>
                                                <div className="icon">Beschikbaar</div>
                                            </div>
                                            <div className="price">Prijs</div>
                                        </div>
                                    </div>
                                </a>
                            </div>

                            <div className="col-md-6 col-lg-4">
                                <a href="#">
                                    <div className="card">
                                        <img className="card-img-top" src="" alt="Card image"></img>
                                        <div className="card-body">
                                            <h5 className="card-title">Auto</h5>
                                            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                            <div className="icons">
                                                <div className="icon">Type</div>
                                                <div className="icon">Merk</div>
                                                <div className="icon">Model</div>
                                                <div className="icon">Koop Jaar</div>
                                                <div className="icon">Beschikbaar</div>
                                            </div>
                                            <div className="price">Prijs</div>
                                        </div>
                                    </div>
                                </a>
                            </div>

                            <div className="col-md-6 col-lg-4">
                                <a href="#">
                                    <div className="card">
                                        <img className="card-img-top" src="" alt="Card image"></img>
                                        <div className="card-body">
                                            <h5 className="card-title">Auto</h5>
                                            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                            <div className="icons">
                                                <div className="icon">Type</div>
                                                <div className="icon">Merk</div>
                                                <div className="icon">Model</div>
                                                <div className="icon">Koop Jaar</div>
                                                <div className="icon">Beschikbaar</div>
                                            </div>
                                            <div className="price">Prijs</div>
                                        </div>
                                    </div>
                                </a>
                            </div>


                            <div className="col-md-6 col-lg-4">
                                <a href="#">
                                    <div className="card">
                                        <img className="card-img-top" src="" alt="Card image"></img>
                                        <div className="card-body">
                                            <h5 className="card-title">Auto</h5>
                                            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                            <div className="icons">
                                                <div className="icon">Type</div>
                                                <div className="icon">Merk</div>
                                                <div className="icon">Model</div>
                                                <div className="icon">Koop Jaar</div>
                                                <div className="icon">Beschikbaar</div>
                                            </div>
                                            <div className="price">Prijs</div>
                                        </div>
                                    </div>
                                </a>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RentScreen