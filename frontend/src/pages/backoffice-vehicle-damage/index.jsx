import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './styles.scss';

function BackofficeVehicleDamage() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [damages, setDamages] = useState([]); 
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

  const handleApprove = async (damageId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/Damage/${damageId}/approve`, {
        method: "PUT",
      });
      if (response.ok) {
        const updatedDamage = await response.json();
        setDamages((prevDamages) =>
          prevDamages.map((damage) =>
            damage.id === updatedDamage.id ? updatedDamage : damage
          )
        );
        alert("Damage approved!");
      } else {
        alert("Error approving damage!");
      }
    } catch (error) {
      console.error("Error approving damage:", error);
      alert("Error approving damage!");
    }
  };

  const handleSetPending = async (damageId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/Damage/${damageId}/pending`, {
        method: "PUT",
      });
      if (response.ok) {
        const updatedDamage = await response.json();
        setDamages((prevDamages) =>
          prevDamages.map((damage) =>
            damage.id === updatedDamage.id ? updatedDamage : damage
          )
        );
        alert("Damage set to Pending!");
      } else {
        alert("Error setting damage to Pending!");
      }
    } catch (error) {
      console.error("Error setting damage to Pending:", error);
      alert("Error setting damage to Pending!");
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
            <h2>Damages:</h2>
            {damages.length > 0 ? (
              <ul>
                {damages.map((damage) => (
                  <li key={damage.id}>
                    {damage.description} - <strong>{damage.status}</strong>
                    {damage.status !== 'Approved' && (
                      <button onClick={() => handleApprove(damage.id)}>Approve</button>
                    )}                  
                    {damage.status !== 'Pending' && damage.status !== 'Approved' && (
                      <button onClick={() => handleSetPending(damage.id)}>Set to pending</button>
                    )}
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

export default BackofficeVehicleDamage;
