import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './styles.scss';

function RentScreen() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [formData, setFormData] = useState({
    travelPurpose: "",
    furthestDestination: "",
    expectedDistance: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    async function fetchVehicle() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/Vehicle/${id}`, {
          withCredentials: true
        });

        setVehicle(response.data || []);
        setLoading(false);
      } catch (e) {
        console.error("Error fetching vehicle:", error.message);
      }
    }

    fetchVehicle();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const rentData = {
      ...formData,
      vehicleId: parseInt(id, 10),
      expectedDistance: parseFloat(formData.expectedDistance),
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
    };
    console.log("Rent data being sent:", rentData);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/rent`,
        rentData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert("Rental successfully created!");
      } else {
        console.error("Server error details:", response.data);
        alert(`Error creating rental: ${response.data.message || "Check the payload"}`);
      }
    } catch (error) {
      if (error.response) {
        console.error("Server error details:", error.response.data);
        alert(`Error creating rental: ${error.response.data.message || "Check the payload"}`);
      } else {
        console.error("Request error:", error);
        alert("Error creating rental!");
      }
    }
  };

  return (
    <div className="rent-screen">
      <div className="form-container">
        {vehicle ? (
          <>
            <h1>Rent {vehicle.brand} {vehicle.model}</h1>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Travel Purpose:</label>
                <input type="text" name="travelPurpose" value={formData.travelPurpose} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Furthest Destination:</label>
                <input type="text" name="furthestDestination" value={formData.furthestDestination} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Expected Distance (km):</label>
                <input type="number" name="expectedDistance" value={formData.expectedDistance} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Start Date:</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date:</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="submit-btn">Rent</button>
            </form>
          </>
        ) : (
          <p>Loading vehicle details...</p>
        )}
      </div>
    </div>
  );
}

export default RentScreen;
