import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './styles.scss';

function BackofficeVehicleDamage() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [damages, setDamages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVehicleAndDamages() {
      try {
        const [vehicleResponse, damageResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_APP_API_URL}/Vehicle/${id}`, {
            withCredentials: true,
          }),
          axios.get(`${import.meta.env.VITE_APP_API_URL}/Damage/vehicle/${id}`, {
            withCredentials: true,
          })
        ]);

        setVehicle(vehicleResponse.data);
        setDamages(Array.isArray(damageResponse.data.$values) ? damageResponse.data.$values : []);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchVehicleAndDamages();
  }, [id]);

  const updateDamageStatus = async (damageId, status) => {
    try {
      let url;

      if (status === "Approved") {
        url = `${import.meta.env.VITE_APP_API_URL}/Damage/${damageId}/approve`;
      } else if (status === "Decline") {
        url = `${import.meta.env.VITE_APP_API_URL}/Damage/${damageId}/decline`;
      }

      const response = await axios.put(url, {}, {
        withCredentials: true,
      });

      setDamages((prevDamages) =>
        prevDamages.map((damage) =>
          damage.id === response.data.id ? response.data : damage
        )
      );
      alert(`Damage ${status}!`);
    } catch (error) {
      console.error(`Error setting damage to ${status}:`, error);
      alert(`Error setting damage to ${status}!`);
    }
  };

  if (loading) {
    return <p>Loading vehicle details...</p>;
  }

  return (
    <div className="page page-backoffice-vehicle-damage">
        <div className="container">
        {vehicle ? (
          <>
            <h1 className="vehicle">
              {vehicle.brand} {vehicle.model}
            </h1>

            <div>
              <h1>Schade:</h1>
              {damages.length > 0 ? (
                <ul>
                  {damages.map((damage) => (
                    <li key={damage.id}>
                      {damage.description} - <strong>{damage.status}</strong>
                      
                      {(damage.status !== "Accepted" && damage.status !== "Declined") && (
                        <>
                          <button className="approve-button"
                            onClick={() => updateDamageStatus(damage.id, "Approved")}
                          >
                            Approve
                          </button>
                          <button className="decline-button"
                            onClick={() => updateDamageStatus(damage.id, "Decline")}
                          >
                            Decline
                          </button>
                        </>
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
          <p>No vehicle damage.</p>
        )}
      </div>
    </div>
  );
}

export default BackofficeVehicleDamage;