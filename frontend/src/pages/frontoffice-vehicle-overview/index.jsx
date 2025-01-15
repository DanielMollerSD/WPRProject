import './styles.scss';
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

function VehicleOverview() {
    const [vehicles, setVehicles] = useState([]);
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [vehicleBrands, setVehicleBrands] = useState([]);
    const [selectedVehicleType, setSelectedVehicleType] = useState("all");
    const [selectedVehicleBrand, setSelectedVehicleBrand] = useState("all");
    const [minPrice, setMinPrice] = useState();
    const [maxPrice, setMaxPrice] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [error, setError] = useState(null);

    async function fetchVehicles() {
        try {
            const params = new URLSearchParams();
            if (selectedVehicleType !== "all") params.append("vehicleType", selectedVehicleType);
            if (selectedVehicleBrand !== "all") params.append("brand", selectedVehicleBrand);
            if (minPrice) params.append("minPrice", minPrice);
            if (maxPrice) params.append("maxPrice", maxPrice);
            if (startDate) params.append("startDate", startDate);
            if (endDate) params.append("endDate", endDate);

            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/Vehicle?${params.toString()}`);
            if (!response.ok) throw new Error("Failed to fetch vehicles");

            const data = await response.json();
            setVehicles(data);

        } catch (e) {
            console.error(e.message);
            setError("Failed to load vehicles");
        }
    }

    useEffect(() => {
        fetchVehicles();
    }, []);

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <div className="page page-rent-screen">
            <div className="container">
                <div className="rent-screen-content">
                    <div className="vehicle-list">
                        <table className="vehicle-table">
                            <thead>
                                <tr>
                                    <th>Merk</th>
                                    <th>Model</th>
                                    <th>Type</th>
                                    <th>Koop Jaar</th>
                                    <th>Status</th>
                                    <th>Note</th>
                                    <th>Prijs</th>
                                    <th>Schade</th>
                                    <th>Note</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vehicles.map((vehicle, index) => (
                                    <tr key={index}>
                                        <td>{vehicle.brand}</td>
                                        <td>{vehicle.model}</td>
                                        <td>{vehicle.vehicleType}</td>
                                        <td>{vehicle.purchaseYear}</td>
                                        <td>{vehicle.status}</td>
                                        <td>{vehicle.note}</td>
                                        <td>€{vehicle.price} /dag</td>
                                        <td>
                                            <Link to={`/damage/${vehicle.id}`}>Bekijk</Link>
                                        </td>
                                        <td>
                                            <Link to={`/note/${vehicle.id}`}>Bekijk</Link>
                                        </td>
                                        <td>
                                            <Link to={`/status/${vehicle.id}`}>Bekijk</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VehicleOverview;
