import axios from "axios";
import "./styles.scss";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
  
      // Make the Axios GET request
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/Vehicle?${params.toString()}`,
        {
          withCredentials: true,
        }
      );
  
      console.log("Response data:", response.data);
  
      const vehicles = response.data.$values || [];
      setVehicles(vehicles);
  
      if (vehicleTypes.length === 0) {
        const types = Array.from(new Set(vehicles.map((vehicle) => vehicle.vehicleType)));
        setVehicleTypes([...types]);
      }
  
      if (vehicleBrands.length === 0) {
        const brands = Array.from(new Set(vehicles.map((vehicle) => vehicle.brand)));
        setVehicleBrands([...brands]);
      }
    } catch (e) {
      console.error("Error fetching vehicles:", e.message);
      setError("Failed to load vehicles");
    }
  }

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleTypeChange = (event) => {
    const selected = event.target.value;
    setSelectedVehicleType(selected);
  };

  const handleBrandChange = (event) => {
    const selected = event.target.value;
    setSelectedVehicleBrand(selected);
  };

  const handleMinPriceChange = (event) => {
    const price = Math.max(0, Number(event.target.value));
    setMinPrice(price || undefined);
  };

  const handleMaxPriceChange = (event) => {
    const price = Math.max(0, Number(event.target.value));
    setMaxPrice(price || undefined);
  };

  const handleStartDateChange = (event) => {
    const startDate = event.target.value;
    setStartDate(startDate);
  };

  const handleEndDateChange = (event) => {
    const endDate = event.target.value;
    setEndDate(endDate);
  };

  const handleSearchButton = (event) => {
    fetchVehicles();
  };

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="page page-vehicle-overview">
        <div className="container">
          <div className="vehicle-filters">
            <div className="filter-item">
              <div className="filter-title">Voertuigcategorieën:</div>
              <select
                name="vehicleType"
                id="vehicleType"
                value={selectedVehicleType}
                onChange={handleTypeChange}
              >
                <option value="all">Alle Voertuigen</option>
                {vehicleTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-item">
              <div className="filter-title">Merk:</div>
              <select
                name="vehicleBrand"
                id="vehicleBrand"
                value={selectedVehicleBrand}
                onChange={handleBrandChange}
              >
                <option value="all">Alle Merken</option>
                {vehicleBrands.map((brand, index) => (
                  <option key={index} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-item">
              <div className="filter-title">Laagste prijs:</div>
              <input
                type="number"
                name="minPrice"
                id="minPrice"
                placeholder="Min Prijs"
                value={minPrice || ""}
                onChange={handleMinPriceChange}
              />
            </div>

            <div className="filter-item">
              <div className="filter-title">Hoogste prijs:</div>
              <input
                type="number"
                name="maxPrice"
                id="maxPrice"
                placeholder="Max Prijs"
                value={maxPrice || ""}
                onChange={handleMaxPriceChange}
              />
            </div>

            <div className="filter-item">
              <div className="filter-title">Start datum:</div>
              <input
                type="date"
                name="startDate"
                id="startDate"
                placeholder="Start datum"
                value={startDate || ""}
                onChange={handleStartDateChange}
              />
            </div>

            <div className="filter-item">
              <div className="filter-title">Eind datum:</div>
              <input
                type="date"
                name="endDate"
                id="endDate"
                placeholder="Eind datum"
                value={endDate || ""}
                onChange={handleEndDateChange}
              />
            </div>

            <button className="search-button" onClick={handleSearchButton}>
              Zoek
            </button>
          </div>

          <div className="cards-container">
            <div className="row">
              {vehicles.map((vehicle, index) => (
                <div className="col-md-6 col-lg-4" key={index}>
                  <Link to={`/rent/${vehicle.id}`}>
                    <div className="card">
                      <img
                        className="card-img-top"
                        src={vehicle.imageUrl || "https://via.placeholder.com/500x300" }
                        alt={`image ${vehicle.brand} ${vehicle.model}`}
                      />
                      <div className="card-body">
                        <h5 className="card-title">
                          {vehicle.brand} {vehicle.model}
                        </h5>
                        <p className="card-description">{vehicle.note}</p>
                        <div className="tags">
                          <div className="tag">
                            <strong>Type:</strong> {vehicle.vehicleType}
                          </div>
                          <div className="tag">
                            <strong>Merk:</strong> {vehicle.brand}
                          </div>
                          <div className="tag">
                            <strong>Model:</strong> {vehicle.model}
                          </div>
                          <div className="tag">
                            <strong>Kleur:</strong> {vehicle.color}
                          </div>
                          <div className="tag">
                            <strong>Koop Jaar:</strong> {vehicle.purchaseYear}
                          </div>
                          <div className="tag">
                            <strong>Status:</strong> {vehicle.status}
                          </div>
                        </div>
                        <div className="price">
                          €{vehicle.price} <span> /dag</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
    </div>
  );
}

export default VehicleOverview;