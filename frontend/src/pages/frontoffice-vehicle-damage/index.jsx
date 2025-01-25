import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
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
        const vehicleResponse = await axios.get(`${import.meta.env.VITE_APP_API_URL}/Vehicle/${id}`, {
          withCredentials: true,
        });
        setVehicle(vehicleResponse.data);

        const damageResponse = await axios.get(`${import.meta.env.VITE_APP_API_URL}/Damage/vehicle/${id}`, {
          withCredentials: true,
        });
        setDamages(Array.isArray(damageResponse.data.$values) ? damageResponse.data.$values : []);
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
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/Damage`,
        { description: damageDescription, vehicleId: parseInt(id, 10) },
        { withCredentials: true }
      );
      setDamages((prevDamages) => Array.isArray(prevDamages) ? [...prevDamages, response.data] : [response.data]);
      setDamageDescription("");
      alert("Damage pending for approval!");
    } catch (error) {
      console.error("Error submitting damage:", error);
      alert("Error adding damage!");
    }
  };

  if (loading) {
    return <p>Loading vehicle details...</p>;
  }

  return (
    <div className="page page-frontoffice-vehicle-damage">
      <div className="container">
        {vehicle ? (
          <>
            <h1 className="vehicle">{vehicle.brand} {vehicle.model}</h1>
            <div>
              <form onSubmit={handleDamageSubmit}>
                <div className="form-group">
                  <label>Beschrijving:</label>
                  <textarea
                    value={damageDescription}
                    onChange={(e) => setDamageDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="submit-btn">Voeg schade toe</button>
              </form>
            </div>
            <div>
              <h1>Schade:</h1>
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
    </div>
  );
}

export default VehicleDamage;