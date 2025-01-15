import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './styles.scss';

function VehicleDamage() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [damages, setDamages] = useState([]); 
  const [damageDescription, setDamageDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVehicleAndDamages() {
      try {
        // Fetch vehicle data
        const vehicleResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}/Vehicle/${id}`);
        const vehicleData = await vehicleResponse.json();
        setVehicle(vehicleData);

        // Fetch damages for the specific vehicle
        const damageResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}/Damage/vehicle/${id}`);
        const damageData = await damageResponse.json();
        setDamages(Array.isArray(damageData) ? damageData : []); //initialize
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchVehicleAndDamages();
  }, [id]);

  const handleDamageSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/Damage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: damageDescription, vehicleId: parseInt(id, 10) }),
      });
      if (response.ok) {
        const newDamage = await response.json();
        setDamages((prevDamages) => Array.isArray(prevDamages) ? [...prevDamages, newDamage] : [newDamage]); // Ensure prevDamages is an array
        setDamageDescription(""); // Clear input field
        alert("Damage pending for approval!");
      } else {
        alert("Error adding damage!");
      }
    } catch (error) {
      console.error("Error submitting damage:", error);
      alert("Error adding damage!");
    }
  };

  if (loading) {
    return <p>Loading vehicle details...</p>;
  }

  return (
    <div className="vehicle-overview">
      {vehicle ? (
        <>
          <h1>{vehicle.brand} {vehicle.model}</h1>
          <div>
            <h2>Add Damage</h2>
            <form onSubmit={handleDamageSubmit}>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={damageDescription}
                  onChange={(e) => setDamageDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <button type="submit" className="submit-btn">Add Damage</button>
            </form>
          </div>
          <div>
            <h2>Damages:</h2>
            {damages.length > 0 ? (
              <ul>
                {damages.map((damage) => (
                  <li key={damage.id}>
                    {damage.description} - <strong>{damage.status}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No damages.</p>
            )}
          </div>
        </>
      ) : (
        <p>Vehicle details not found.</p>
      )}
    </div>
  );
}

export default VehicleDamage;
