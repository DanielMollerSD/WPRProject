import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './styles.scss';

function RentScreen() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    travelPurpose: "",
    furthestDestination: "",
    expectedDistance: "",
    pickupLocation: "",
    pickupTime: "",
    safetyInstructions: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    // Fetch
    async function fetchVehicle() {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/Vehicle/${id}`);
        if (!response.ok) throw new Error("Vehicle not found");
        const data = await response.json();
        setVehicle(data);
      } catch (error) {
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
      //pickupTime: new Date(formData.pickupTime).toISOString(),
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
    };
    console.log("Rent data being sent:", rentData);

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/Rent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rentData),
      });
      
      if (response.ok) {
        alert("Rental successfully created!");
      } else {
        const errorDetails = await response.json();
        console.error("Server error details:", errorDetails);
        alert(`Error creating rental: ${errorDetails.message || "Check the payload"}`);
      }
    } catch (error) {
      console.error("Request error:", error);
      alert("Error creating rental!");
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
                <label>First Name:</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Last Name:</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Address:</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} required />
              </div>
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
                <label>Pickup Location:</label>
                <input type="text" name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Pickup Time:</label>
                <input type="datetime-local" name="pickupTime" value={formData.pickupTime} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Safety Instructions:</label>
                <textarea name="safetyInstructions" value={formData.safetyInstructions} onChange={handleChange}></textarea>
              </div>
              <div className="form-group">
                <label>Start Date:</label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date:</label>
                <input
                  type="datetime-local"
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
