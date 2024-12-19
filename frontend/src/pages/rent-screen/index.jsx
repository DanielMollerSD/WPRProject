import './styles.scss';
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

function RentScreen() {
    const [vehicles, setVehicles] = useState([]);
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [selectedType, setSelectedType] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchVehicles() {
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/Vehicle`);
                if (!response.ok) throw new Error("Failed to fetch vehicles");
                console.log(response)
                
                const data = await response.json();
                setVehicles(data);

                const types = Array.from(new Set(data.map(vehicle => vehicle.vehicleType)));
                setVehicleTypes(types);

                setFilteredVehicles(data);
            } catch (e) {
                console.error(e.message);
                setError("Failed to load vehicles");
            }
        }
        fetchVehicles();
    }, []);

    const handleTypeChange = (event) => {
        const selected = event.target.value;
        setSelectedType(selected);

        // Filter vehicles based on the selected type
        if (selected === "all") {
            setFilteredVehicles(vehicles); // Show all vehicles if "all" is selected
        } else {
            setFilteredVehicles(vehicles.filter(vehicle => vehicle.vehicleType === selected));
        }
    };

    return (
        <div className="page page-rent-screen">
            <div className="container">
                <div className="rent-screen-content">
                    <div className="vehicle-select">
                        <select name="vehicleType" id="vehicleType" value={selectedType} onChange={handleTypeChange}>
                            <option value="all">Alle Voertuigen</option>
                            {vehicleTypes.map((type, index) => (
                                <option key={index} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    {error && <p className="error-message">{error}</p>}

                    <div className="cards-container">
                        <div className="row">
                        {filteredVehicles.map((vehicle, index) => (
                                <div className="col-md-6 col-lg-4" key={index}>
                                    <a href="#">
                                        <div className="card">
                                            <img className="card-img-top" src="https://via.placeholder.com/500x300" alt="Card image" />
                                            <div className="card-body">
                                                <h5 className="card-title">{vehicle.brand} {vehicle.model}</h5>
                                                <p className="card-description">{vehicle.note}</p>
                                                <div className="tags">
                                                    <div className="tag"><strong>Type:</strong> {vehicle.vehicleType}</div>
                                                    <div className="tag"><strong>Merk:</strong> {vehicle.brand}</div>
                                                    <div className="tag"><strong>Model:</strong> {vehicle.model}</div>
                                                    <div className="tag"><strong>Koop Jaar:</strong> {vehicle.purchaseYear}</div>
                                                    <div className="tag"><strong>Status:</strong> {vehicle.status}</div>
                                                </div>
                                                <div className="price">€{vehicle.price} <span> /dag</span></div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RentScreen;
